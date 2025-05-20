/**
 * Fetches data from API.
 * @param {string} url - URL adress of API.
 */
async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Displays data from API in HTML table.
 * @param {string} url - URL adress of API.
 * @param {string} element - HTML element to table display.
 * @param {string[]} customHeaders - optional custom table headers array.
 */
async function displayPrices(url, element, customHeaders = []) {
    const prices = await getData(url);
    const pricesElement = document.getElementById(element);
    let dataToDisplay = prices;

    if (prices && prices.hasOwnProperty("rates") && Array.isArray(prices.rates)) {
        dataToDisplay = prices.rates;
    }

    if (pricesElement && dataToDisplay.length > 0) {
        const headers = Object.keys(dataToDisplay[0]);
        let tableHTML = `
        <table class="table table-bordered table-striped w-auto">
          <thead>
            <tr class="table-light">
      `;

        if (Array.isArray(customHeaders) && customHeaders.length > 0) {
            customHeaders.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
        } else {
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
        }


        tableHTML += `
            </tr>
          </thead>
          <tbody>
      `;

        dataToDisplay.forEach(item => {
            tableHTML += `<tr class="table-light">`;
            headers.forEach(header => {
                tableHTML += `<td>${item[header]}</td>`;
            });
            tableHTML += `</tr>`;
        });

        tableHTML += `
          </tbody>
        </table>
      `;

        pricesElement.innerHTML = tableHTML;
    } else if (!pricesElement) {
        console.log(`Element o id ${element}' nie został znaleziony na stronie.`);
    } else if (dataToDisplay.length === 0) {
        console.log("Tablica danych do wyświetlenia jest pusta.");
    }
}

async function displayChart(url, element, label, defaultKeys = [0, 1], borderColor = 'gold') {
    const data = await getData(url);
    const chartElement = document.getElementById(element);
    let dataToDisplay = data;

    if (data && data.hasOwnProperty("rates") && Array.isArray(data.rates)) {
        dataToDisplay = data.rates;
    }

    if (chartElement && dataToDisplay.length > 0) {
        const keys = Object.keys(dataToDisplay[0]);
        const config = {
            type: 'line',
            data: {
                labels: dataToDisplay.map(row => row[keys[defaultKeys[0]]]),
                datasets: [
                    {
                        label: label,
                        data: dataToDisplay.map(row => row[keys[defaultKeys[1]]]),
                        borderColor: borderColor
                    }
                ]
            }
        }

        new Chart(
            document.getElementById(element),
            config
        );
    } else if (!chartElement) {
        console.log(`Element o id ${element}' nie został znaleziony na stronie.`);
    } else if (dataToDisplay.length === 0) {
        console.log("Tablica danych do wyświetlenia jest pusta.");
    }
};

function reloadPage() {
    var selectElement = document.getElementById("dataCount");
    var selectedValue = selectElement.value;
    window.location.href = "?count=" + selectedValue;
}