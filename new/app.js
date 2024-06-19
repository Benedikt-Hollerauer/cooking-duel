let currentTab = 0; // Current tab is set to be the first tab (0)

showTab(currentTab); // Display the current tab

/**
 * Function to display the specified tab of the form
 * @param {number} n - The index of the tab to be displayed
 */
function showTab(n) {
    const tabs = document.getElementsByClassName("tab");
    tabs[n].style.display = "block";

    // Hide/Show the Previous/Next buttons
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (n === tabs.length - 1) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }

    // Run a function to display the correct step indicator
    fixStepIndicator(n);
}

/**
 * Function to navigate between tabs
 * @param {number} n - The step value (1 for next, -1 for previous)
 */
function nextPrev(n) {
    const tabs = document.getElementsByClassName("tab");

    // Exit the function if any field in the current tab is invalid
    if (n === 1 && !validateForm()) return false;

    // Hide the current tab
    tabs[currentTab].style.display = "none";

    // Update the current tab index
    currentTab += n;

    // If the form is completed, create the summary
    if (currentTab >= tabs.length) {
        createSummary();
        return false;
    }

    // Otherwise, display the correct tab
    showTab(currentTab);
}

/**
 * Function to validate the form fields in the current tab
 * @returns {boolean} - True if all fields are valid, false otherwise
 */
function validateForm() {
    const tabs = document.getElementsByClassName("tab");
    const inputs = tabs[currentTab].getElementsByTagName("input");
    let valid = true;

    // Loop through all input fields in the current tab
    for (let i = 0; i < inputs.length; i++) {
        // If a field is empty, add an "invalid" class and set valid to false
        if (inputs[i].value === "") {
            inputs[i].className += " invalid";
            valid = false;
        }
    }

    // If the valid status is true, mark the step as finished and valid
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }

    return valid;
}

/**
 * Function to update the step indicator
 * @param {number} n - The index of the current tab
 */
function fixStepIndicator(n) {
    const steps = document.getElementsByClassName("step");

    // Remove the "active" class from all steps
    for (let i = 0; i < steps.length; i++) {
        steps[i].className = steps[i].className.replace(" active", "");
    }

    // Add the "active" class to the current step
    steps[n].className += " active";
}

// Dynamic input fields
const numFieldsInput = document.getElementById('num-fields');
const dynamicFieldsDiv = document.getElementById('members');

numFieldsInput.addEventListener('input', () => {
    const numFields = numFieldsInput.value;
    dynamicFieldsDiv.innerHTML = '';

    for (let i = 0; i < numFields; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Field ${i + 1}`;
        dynamicFieldsDiv.appendChild(input);
    }
});

/**
 * Function to get an array of countries based on the selected region
 * @param {string} region - The selected region
 * @returns {string[]} - An array of countries
 */
function getCountriesFromName(region) {
    const german = [
        "Baden-Württemberg",
        "Bayern",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hessen",
        "Mecklenburg-Vorpommern",
        "Niedersachsen",
        "Nordrhein-Westfalen",
        "Rheinland-Pfalz",
        "Saarland",
        "Sachsen",
        "Sachsen-Anhalt",
        "Schleswig-Holstein",
        "Thüringen"
    ];

    const europa = [
        "Deutschland",
        "Skandinavien",
        "Polen",
        "Be-Ne-Lux",
        "Großbritannien",
        "Österreich/Schweiz",
        "Spanien/Portugal",
        "Italien",
        "Griechenland",
        "Balkan",
        "Frankreich",
        "Tschechien/Slowakei",
        "Ungarn/Rumänien"
    ];

    const international = [
        "Afrika",
        "Asien",
        "Australien",
        "Nordamerika",
        "Russland",
        "Skandinavien",
        "Südamerika"
    ];

    switch (region) {
        case "Deutsch":
            return german;
        case "Europäisch":
            return europa;
        case "International":
            return international;
        default:
            return europa;
    }
}

/**
 * Function to populate the second select dropdown based on the first select value
 * @param {string} firstSelectId - The ID of the first select element
 * @param {string} secondSelectId - The ID of the second select element
 */
function secondSelectFill(firstSelectId, secondSelectId) {
    const firstSelect = document.getElementById(firstSelectId);
    const secondSelect = document.getElementById(secondSelectId);

    // Clear second select options
    secondSelect.innerHTML = '';

    const selectedValue = firstSelect.value;
    if (selectedValue) {
        const countries = getCountriesFromName(selectedValue);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.text = country;
            secondSelect.add(option);
        });

        // Show second select
        secondSelect.style.display = 'block';
    } else {
        // Hide second select
        secondSelect.style.display = 'none';
    }
}

/**
 * Function to create a summary table from the form data
 */
function createSummary() {
    const form = document.getElementById('regForm');
    const formData = new FormData(form);
    const formDataMap = new Map(formData.entries());
    const formDataObj = Object.fromEntries(formDataMap);

    // Get the dynamic input fields
    const dynamicFields = Array.from(document.querySelectorAll('#members input')).map(input => input.value);

    // Store the dynamic fields in a list
    formDataObj['members'] = dynamicFields;

    const formDataDiv = document.createElement('div');

    // Create the table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create the table header row
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = 'Schlüssel';
    headerRow.appendChild(headerCell);
    const valueHeaderCell = document.createElement('th');
    valueHeaderCell.textContent = 'Wert';
    headerRow.appendChild(valueHeaderCell);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body rows
    for (const [key, value] of Object.entries(formDataObj)) {
        const row = document.createElement('tr');
        const keyCell = document.createElement('td');
        keyCell.textContent = getGermanKey(key);
        row.appendChild(keyCell);
        const valueCell = document.createElement('td');
        valueCell.textContent = Array.isArray(value) ? value.join(', ') : value;
        row.appendChild(valueCell);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Add the table to the formDataDiv
    formDataDiv.appendChild(table);

    // Update the summary div with the formDataDiv
    const summaryDiv = document.getElementById('summary');
    const summaryWrapperDiv = document.getElementById("summary-wrapper");
    form.style.display = "none";
    summaryWrapperDiv.style.display = "flex";
    summaryDiv.innerHTML = '';
    summaryDiv.appendChild(formDataDiv);
}

/**
 * Helper function to get the German translation of the key
 * @param {string} key - The key to be translated
 * @returns {string} - The German translation of the key
 */
function getGermanKey(key) {
    const germanKeys = {
        'what-has-to-be-done': 'Was muss getan werden?',
        'which': 'Welche Gerichte sollen es sein?',
        'country-selection': 'Länderauswahl',
        'location': 'Standort',
        'when': 'Wann soll es stattfinden?',
        'members': 'Wer kocht mit?'
    };

    return germanKeys[key] || key;
}

/**
 * Function to open an email client with the summary table as the email body
 */
function openEmailWithSummary() {
    const summaryTable = document.querySelector('#summary table');
    const tableRows = summaryTable.querySelectorAll('tbody tr');
    let emailBody = '';

    tableRows.forEach(row => {
        const key = row.querySelector('td:first-child').textContent;
        const value = row.querySelector('td:last-child').textContent;
        emailBody += `
            ${key}:
            - ${value}\n
        `;
    });

    const mailtoLink = `mailto:?subject=Kochduell Infos&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
}