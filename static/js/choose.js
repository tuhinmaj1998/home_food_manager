async function populateStaples() {
        // Fetch data from FastAPI endpoint
        const response = await fetch("/api/staples");
        const data = await response.json();
        const staples = data.staples;

        // Populate the dropdown
        addOptions("staples", staples);
    }

    function updateCard() {

    // document.getElementById("selectedStaple").textContent = document.getElementById("selectedStaple").textContent.split(" (count:")[0] + " (count: "+ document.getElementById("breadcount").value + ")";
    // var selectedStaple =
    var selectedbreadcount = document.getElementById("breadcount").value;
    if (selectedbreadcount==""){
        var selectedStaple = document.getElementById("staples").options[document.getElementById("staples").selectedIndex].text;

    }
    else{
        var selectedStaple = document.getElementById("staples").options[document.getElementById("staples").selectedIndex].text + " (count: "+ selectedbreadcount + ")";
    }
    var selectedDish1 = document.getElementById("secondDishDropdown1").options[document.getElementById("secondDishDropdown1").selectedIndex].text;
    var selectedDish2 = document.getElementById("secondDishDropdown2").options[document.getElementById("secondDishDropdown2").selectedIndex].text;

    // Create a table with three rows
    var table = document.createElement("table");



    // Row for Staple
    var row1 = table.insertRow(0);
    var cell1 = row1.insertCell(0);
    var cell2 = row1.insertCell(1);
    cell1.textContent = "Staple:";
    cell2.textContent = selectedStaple;

    cell2.id = "selectedStaple";

    // Row for Dish1
    var row2 = table.insertRow(1);
    var cell3 = row2.insertCell(0);
    var cell4 = row2.insertCell(1);
    cell3.textContent = "Dish1:";
    if (selectedDish1 == "Select Dish"){
        cell4.textContent = "NA";
    }
    else{
        cell4.textContent = selectedDish1;
    }
    //cell4.textContent = selectedDish1;
    cell4.id = "selectedDish1";

    // Row for Dish2
    var row3 = table.insertRow(2);
    var cell5 = row3.insertCell(0);
    var cell6 = row3.insertCell(1);
    cell5.textContent = "Dish2:";

    if (selectedDish2 == "Select Dish"){
        cell6.textContent = "NA";
    }
    else{
        cell6.textContent = selectedDish2;
    }

    cell6.id = "selectedDish2";

    // Clear the existing content and append the table to the "selectedText" div
    var selectedTextDiv = document.getElementById("selectedText");
    selectedTextDiv.innerHTML = '';
    selectedTextDiv.appendChild(table);
}

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }


    async function updateSecondDropdown(sourceDropdownId, targetDropdownId, containerId) {
        var sourceDropdown = document.getElementById(sourceDropdownId);
        var targetDropdown = document.getElementById(targetDropdownId);
        var container = document.getElementById(containerId);

        // Reset target dropdown
        targetDropdown.innerHTML = '<option value="0">Select Dish</option>';

        // Check the selected value in the source dropdown
        var selectedValue = sourceDropdown.value;

        // Show or hide the target dropdown container based on selection
        container.style.display = selectedValue !== "0" ? "block" : "none";

        // If a value is selected, fetch and populate the target dropdown
        if (selectedValue !== "0") {
            // Fetch data from FastAPI endpoint based on selected value
            // Replace the "/api/dishes/{value}" endpoint with your actual endpoint
            const response = await fetch(`/api/dishes/${selectedValue}`);
            const data = await response.json();
            const dishes = data.dishes;

            // Populate the target dropdown
            addOptions(targetDropdownId, dishes);

            // Update the card with the selected values
            updateCard(
                sourceDropdown.options[sourceDropdown.selectedIndex].text,
                targetDropdown.options[targetDropdown.selectedIndex].text,  // Dish 1
                targetDropdown.options[0].text   // Dish 2
            );
        } else {
            // If no value is selected, update the card with default values
            updateCard("Not selected", "Not selected", "Not selected");
        }
    }

    function addOptions(selectElementId, optionsArray) {
        var selectElement = document.getElementById(selectElementId);

        optionsArray.forEach(function (optionText, index) {
            var option = document.createElement("option");
            option.value = index + 1;  // You may want to adjust the value
            option.text = optionText;
            selectElement.add(option);
        });
    }

    // Function to handle submit button click
        function submitSelection() {
            // You can add your logic here to perform a POST request with the selected data
            // For now, I'm just logging the selected data to the console
            var selectedStaple = document.getElementById("selectedStaple").textContent;
            var selectedDish1 = document.getElementById("selectedDish1").textContent;
            var selectedDish2 = document.getElementById("selectedDish2").textContent;

            console.log("Selected Staple:", selectedStaple);
            console.log("Selected Dish 1:", selectedDish1);
            console.log("Selected Dish 2:", selectedDish2);

            // If you want to perform a POST request, you can use the fetch API here
            // Example:
            fetch("/submit", {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json",
                 },
                 body: JSON.stringify({
                     staple: selectedStaple,
                     dish1: selectedDish1,
                     dish2: selectedDish2,
                 }),
             })
             .then(response => response.json())
             .then(data => console.log("Submit response:", data))
             .catch(error => console.error('Error submitting data:', error));

             wait(1000);
             console.log('ok!')

             //location.href = "/all_results";
             alert("Update Done!");
        }


    // Call the function to populate the options initially
    populateStaples();

    async function checkifbread(selectedstaple){
        console.log(selectedstaple);
        const response = await fetch(`/api/checkifbread/${selectedstaple}`);
        const data = await response.json();
        const isbread = data.isbread;
        //console.log(isbread);
        if (isbread){
            document.getElementById('breadcountdiv').style.display = 'Block';
        }
        else{
            document.getElementById('breadcountdiv').style.display = 'None';
            document.getElementById('breadcount').value = "";
        }

    }

    async function breadcount(value){
    console.log(value);
    document.getElementById("selectedStaple").textContent = document.getElementById("selectedStaple").textContent.split(" (count:")[0] + " (count: "+ document.getElementById("breadcount").value + ")";
    return value;
    }