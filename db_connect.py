

import pandas as pd
import psycopg2


host = 'rain.db.elephantsql.com'
# host = str(os.environ['host'])
database = 'rqlhbipg'

username = 'rqlhbipg'
password = 'nFReJlmf7g33cBJB0zgug5Q8S1m_aOAX'
port = 5432


def db_cursor():
    # print('host')
    # host = os.environ['host']
    # print(host)
    # database = os.environ['database']
    # username = os.environ['username']
    # password = os.environ['password']
    # port = os.environ['port']
    conn = psycopg2.connect(host=host, dbname=database, user=username, password=password, port=port)
    return conn


def db_collect_staples():
    conn = db_cursor()
    cursor = conn.cursor()
    cursor.execute(f"""SELECT staple_name FROM "home_food_manager"."staples";""")
    staples = [i[0] for i in cursor.fetchall()]
    return staples


def db_collect_dishes(staple_id):
    conn = db_cursor()
    cursor = conn.cursor()
    cursor.execute(f"""
    select dish_name from home_food_manager.dish_suggestions ds
    join home_food_manager.staples s on s.staple_id = ds.staple_id
    join home_food_manager.dishes d on d.dish_id = ds.dish_id where ds.staple_id = {staple_id}
    group by dish_name;
    """)
    dishes = [i[0] for i in cursor.fetchall()]
    return dishes


# print(db_collect_dishes())

def db_add_daily_menu(staple, dish1, dish2, remarks=None):
    conn = db_cursor()
    cursor = conn.cursor()
    cursor.execute(f"""
        select daily_menu_id from  home_food_manager.daily_menu 
        where substring(cast(createddate+interval '5.5 hour' as varchar), 1,10) = substring(cast(now()+interval '5.5 hour' as varchar), 1,10)
        limit 1;""")
    daily_menu_id = None
    if_exist_id = cursor.fetchone()

    if if_exist_id is not None:

        will_be_updated = 1

        daily_menu_id = if_exist_id[0]
        # print(daily_menu_id)
    else:
        will_be_updated = 0

    if will_be_updated:
        print("update")
        q = f"""
        update home_food_manager.daily_menu 
        set staple = '{staple}', dish1 = '{dish1}', dish2 = '{dish2}' 
        where daily_menu_id = {daily_menu_id};"""
        print(q)
        cursor.execute(q)
        conn.commit()

    else:
        cursor.execute(f"""
        insert into home_food_manager.daily_menu("staple", "dish1", "dish2", "createddate")
        values('{staple}', '{dish1}', '{dish2}', now()+interval '5.5 hour');""")
        conn.commit()


def db_get_all_daily_menu():
    conn = db_cursor()
    cursor = conn.cursor()
    q = f"""
            select substring(cast(createddate+interval '5.5 hour' as varchar), 1,10) as createddate, staple, dish1, dish2, remarks  from  home_food_manager.daily_menu 
            order by createddate desc;"""
    # cursor.execute()
    # daily_menus = [i for i in cursor.fetchall()]
    daily_menu = pd.read_sql_query(q, conn)
    return daily_menu


def db_checkifbread(staple_id):
    conn = db_cursor()
    cursor = conn.cursor()
    cursor.execute(f"""
    select 
    case
        when upper(staple_category) in ('BREAD') then 1
        else 0
    end as isbread
    from home_food_manager.staples 
    where staple_id = {staple_id};""")
    isbread = cursor.fetchone()[0]
    return isbread

# print(db_get_all_daily_menu())
