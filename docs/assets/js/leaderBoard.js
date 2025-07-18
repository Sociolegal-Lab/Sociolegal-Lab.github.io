document.addEventListener('DOMContentLoaded', function () {
    function updateButtons(type) {
        const buttonContainer = document.getElementById('button-container');
        buttonContainer.innerHTML = '';

        // 更新 h2 的內容
        const tableTitle = document.getElementById('table-title');
        if (type === 'moral') {
            tableTitle.textContent = "Autonomous Vehicles";
        } else if (type === 'vaccine') {
            tableTitle.textContent = "Vaccine Hesitancy Simulation";
        }

        let buttons;
        if (type === 'moral') {
            buttons = [
                { id: 'accuracy-btn', text: 'Accuracy', type: 'accuracy' },
                { id: 'standard-deviation-btn', text: 'Standard Deviation', type: 'standard-deviation' }
            ];
        } else if (type === 'vaccine') {
            buttons = [
                { id: 'vaccine-perception-btn', text: 'Vaccine-specific Perception', type: 'vaccine-perception' },
                { id: 'vaccine-hesitancy-btn', text: 'Vaccine Hesitancy', type: 'vaccine-hesitancy' },
                { id: 'vaccination-mandates-btn', text: 'Vaccination Mandates', type: 'vaccination-mandates' }
            ];
        }

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.textContent = button.text;
            btn.dataset.type = button.type;
            btn.addEventListener('click', function () {
                document.querySelectorAll('.button-container button').forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');
                if (type === 'moral') {
                    updateTable();
                } else if (type === 'vaccine') {
                    updateVaccineTable();
                }
            });
            buttonContainer.appendChild(btn);
        });

        // Add explanation text for moral scenario
        if (type === 'moral') {
            document.getElementById('explanation').innerHTML = `
                <p>Accuracy is the proportion of scenarios where an LLM’s moral choices align with human responses, reflecting how consistent the LLM's decisions are with human responses across different cultural groups.</p>
                <p>Standard deviation is the square root of the mean squared deviation between the accuracy of each cultural group and the average accuracy across all cultural groups. It represents the dispersion in accuracy across different cultural groups, with larger values indicating greater differences in the LLM’s accuracy among cultural groups. It serves as an indicator for measuring cultural diversity.</p>
            `;
        } else if (type === 'vaccine') {
            document.getElementById('explanation').innerHTML = `
                <p>MAE (Mean Absolute Error) represents the average absolute difference between the predicted values and the actual values. A lower MAE indicates that the model's predictions are closer to the actual values, suggesting higher accuracy.</p>
            `;
        }
    }

    function updateTable() {
        const scenario = document.getElementById('scenario').value;
        const dataType = document.querySelector('.button-container .active')?.dataset.type || 'accuracy';
        const filePath = `assets/data/leaderBoard/${dataType}-${scenario}.csv`;

        console.log(`Fetching data from: ${filePath}`); // Debug information

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(csvText => {
                const rows = csvText.split('\n');
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = '';

                rows.slice(1).forEach(row => {
                    const cols = row.split(',');
                    const tr = document.createElement('tr');
                    cols.forEach(col => {
                        const td = document.createElement('td');
                        td.textContent = col;
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    function updateVaccineTable() {
        const scenario = document.getElementById('vaccine-scenario').value;
        let dataType = '';

        switch (scenario) {
            case 'vaccine-perception':
                dataType = 'mae_Vaccine Perception';
                break;
            case 'vaccine-hesitancy':
                dataType = 'mae_Vaccine Hesitancy';
                break;
            case 'vaccination-mandates':
                dataType = 'mae_Vaccination Mandates';
                break;
            default:
                return; // 未選擇
        }

        const filePath = `assets/data/${dataType}.csv`;

        console.log(`Fetching data from: ${filePath}`); // Debug information

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(csvText => {
                const rows = csvText.split('\n');
                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = '';

                rows.slice(1).forEach(row => {
                    const cols = row.split(',');
                    const tr = document.createElement('tr');
                    cols.forEach(col => {
                        const td = document.createElement('td');
                        td.textContent = col;
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error loading CSV file:', error));
    }

    document.getElementById('scenario').addEventListener('change', function () {
        updateButtons('moral');
        updateTable();
    });

    document.getElementById('vaccine-scenario').addEventListener('change', function () {
        updateButtons('vaccine');
        updateVaccineTable();
    });

    // Initialize with default buttons and table
    updateButtons('moral');
    updateTable();
});
