document.addEventListener('DOMContentLoaded', function () {
            var picker = new Pikaday({
                field: document.getElementById('dateFilter'),
                format: 'YYYY-MM-DD',
                onSelect: function () {
                    // Fetch data and populate the table based on the selected date
                    var selectedDate = picker.toString();
                    fetchDataAndPopulateTable(selectedDate);
                }
            });

            // Initial data load without a selected date
            fetchDataAndPopulateTable();
        });

        function fetchDataAndPopulateTable(selectedDate) {
            // TODO: Fetch data using AJAX based on the selected date
            // Replace this with your actual data fetching mechanism
            //var data = [
            //    { "createddate": "2024-01-26", "staple": "Rice", "dish1": "Gobi", "dish2": "Panner-Tikka", "remarks": "None" },
            //    { "createddate": "2024-01-27", "staple": "Roti", "dish1": "Chicken", "dish2": "Mutton", "remarks": "None" },
            //];
//            var data = {{ data | safe }};


            // Filter data based on the selected date
            if (selectedDate) {
                data = data.filter(item => item.createddate === selectedDate);
            }

            // Populate the table with filtered data
            populateTable(data);
        }

        function populateTable(data) {
            var table = document.getElementById('foodTable');

            // Clear existing rows
            table.innerHTML = '';

            // Create header row
            var headerRow = table.insertRow(0);
            for (var key in data[0]) {
                var th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            }

            // Create data rows
            data.forEach(function (rowData, index) {
                var row = table.insertRow(index + 1);
                for (var key in rowData) {
                    var cell = row.insertCell();
                    cell.textContent = rowData[key];
                }
            });
        }