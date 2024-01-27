import json

from fastapi import FastAPI, Request
# from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse

import db_connect

app = FastAPI()
templates = Jinja2Templates(directory='templates')


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# class model1(BaseModel):
#     mytext:str

result = []


#
# @app.post("/submit", response_class=HTMLResponse)
# @app.get("/submit", response_class=HTMLResponse)
# async def submit_form(request: Request):
#     if request.method == 'GET':
#         input1 = int(request.query_params.get("input1", 0))
#         return templates.TemplateResponse("home3.html", {"request": request, "input1": input1})
#     elif request.method == 'POST':
#         form_data = await request.form()
#         input1 = int(form_data.get("input1", 0))
#         print(input1)
#         db_result = db_connect.db_test(input1)
#         result.append(f'{db_result[1]}:{db_result[2]}')
#         return templates.TemplateResponse("home3.html", {"request": request, "input1": input1, "result": result})


# @app.post("/choose", response_class=HTMLResponse)
@app.get("/choose", response_class=HTMLResponse)
async def choose(request: Request):
    if request.method == 'GET':
        input1 = int(request.query_params.get("input1", 0))
        return templates.TemplateResponse("choose.html", {"request": request, "input1": input1})


@app.post("/submit")
async def submit(request: Request):
    form_data = await request.json()
    staple = form_data.get("staple")
    dish1 = form_data.get("dish1")
    dish2 = form_data.get("dish2")

    # Use the received data as needed
    result = {
        "staple": staple,
        "dish1": dish1,
        "dish2": dish2,
    }
    print(result)
    db_connect.db_add_daily_menu(result['staple'], result['dish1'], result['dish2'])
    # return RedirectResponse(url='/all_results', methods='GET')
    return 'Done update!'


@app.get("/all_results")
async def all_results(request: Request):
    df = db_connect.db_get_all_daily_menu()

    # Convert DataFrame to JSON directly
    json_data = df.to_json(orient='records')
    print(json_data)

    return templates.TemplateResponse("daily_menu.html",
                                      {
                                          "request": request,
                                          "data": json_data
                                      })


@app.get("/api/staples")
async def get_staples():
    staples = db_connect.db_collect_staples()
    return JSONResponse(content={"staples": staples})


@app.get("/api/dishes/{staple_id}")
async def get_dishes(staple_id):
    dishes = db_connect.db_collect_dishes(staple_id)
    # print(dishes)
    return JSONResponse(content={"dishes": dishes})


@app.get('/api/checkifbread/{selectedstaple_id}')
async def checkifbread(selectedstaple_id):
    isbread = db_connect.db_checkifbread(selectedstaple_id)
    return JSONResponse(content={"isbread": isbread})

# @app.get("/api/staples")
# async def get_staples():
#     staples = db_connect.db_collect_staples()
#     return JSONResponse(content={"staples": staples})
