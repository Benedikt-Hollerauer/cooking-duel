let currentTab = 0; // Current tab is set to be the first tab (0)
const state = {
    summary: {}
};

showTab(currentTab); // Display the current tab

// Function to display the specified tab of the form
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

// Function to navigate between tabs
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

// Function to validate the form fields in the current tab
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

// Function to update the step indicator
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

window.onload = () => {
    const numFields = numFieldsInput.value;
    dynamicFieldsDiv.innerHTML = '';

    for (let i = 0; i < numFields; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Teilnehmer ${i + 1}`;
        dynamicFieldsDiv.appendChild(input);
    }
}

numFieldsInput.addEventListener('input', () => {
    const numFields = numFieldsInput.value;
    dynamicFieldsDiv.innerHTML = '';

    for (let i = 0; i < numFields; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Teilnehmer ${i + 1}`;
        dynamicFieldsDiv.appendChild(input);
    }
});

// Function to get an array of countries based on the selected region
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
        "Ozeanien",
        "Nordamerika",
        "Südamerika"
    ];

    const southernAmerica = [
        "Brasilien",
        "Argentinien",
        "Kolumbien",
        "Chile",
        "Paraguay"
    ]

    const northernAmerica = [
        "USA",
        "Mexiko",
        "Kanada",
        "Kuba",
        "Jamaika"
    ]

    const ociania = [
        "Australien",
        "Fidschi",
        "Neuseeland"
    ]

    const asia = [
        "China",
        "Japan",
        "Indien",
        "Russland",
        "VAE",
        "Türkei"
    ]

    const africa = [
        "Marokko",
        "Ägypten",
        "Südafrika",
        "Mittelafrika",
        "Madagaskar"
    ]

    switch (region) {
        case "Deutschland":
            return german;
        case "Europäisch":
            return europa;
        case "International":
            return international;
        case "Nordamerika":
            return northernAmerica;
        case "Südamerika":
            return southernAmerica;
        case "Afrika":
            return africa;
        case "Asien":
            return asia;
        case "Ozeanien":
            return ociania;
        default:
            return europa;
    }
}

// Function to populate the second select dropdown based on the first select value
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

        secondSelect.style.display = 'block';
    } else {
        secondSelect.style.display = 'none';
    }
}

function thirdSelectFill(firstSelectId, secondSelectId, thirdSelectId) {
    const secondSelect = document.getElementById(secondSelectId);
    const thirdSelect = document.getElementById(thirdSelectId);
    thirdSelect.innerHTML = '';
    const selectedValue = secondSelect.value;
    const firstSelectValue = document.getElementById(firstSelectId).value;
    if(firstSelectValue == "International") {
        const countries = getCountriesFromName(selectedValue);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.text = country;
            thirdSelect.add(option);
        });
        thirdSelect.style.display = 'block';
    }
  }

function getSelectedValuesFromInputCheckboxes(inputName) {
    const checkboxes = document.querySelectorAll('input[name="'+inputName+'"]:checked');
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedValues
}

// Function to create a summary and store it in the state object
function createSummary() {
    const formData = new FormData(document.getElementById('regForm'));
    const formDataObj = Object.fromEntries(formData);
    
    const thirdSelection = document.getElementById('third-country-selection');
    const secondSelection = document.getElementById('further-country-selection');
    const firstCountrySelection = document.getElementById('country-selection')
    
    formDataObj['country-selection'] = thirdSelection.style.display !== 'none' ? thirdSelection.value :
                                       secondSelection.style.display !== 'none' ? secondSelection.value :
                                       firstCountrySelection.value == 'Auswählen' ? "Deutschland" : firstCountrySelection.value;
    
    formDataObj['members'] = Array.from(document.querySelectorAll('#members input')).map(input => input.value);
    formDataObj['what-has-to-be-done'] = getSelectedValuesFromInputCheckboxes("what-has-to-be-done");
    formDataObj['which'] = getSelectedValuesFromInputCheckboxes("which");
    
    state.summary = formDataObj;
    renderSummary();
  }
  

// Function to render the summary in the UI
function renderSummary() {
    const summaryDiv = document.getElementById('summary');
    const summaryWrapperDiv = document.getElementById("summary-wrapper");
    const form = document.getElementById('regForm');

    // Clear the summary div
    summaryDiv.innerHTML = '';

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
    for (const [key, value] of Object.entries(state.summary)) {
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

    // Add the table to the summaryDiv
    summaryDiv.appendChild(table);

    // Update the UI
    form.style.display = "none";
    summaryWrapperDiv.style.display = "flex";
}

// Helper function to get the German translation of the key
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

// Function to open an email client with the summary data
function openEmailWithSummary() {
    let emailBody = '';

    for (const [key, value] of Object.entries(state.summary)) {
        emailBody += `
${getGermanKey(key)}:
- ${Array.isArray(value) ? value.join(', ') : value}\n
`;
    }

    const mailtoLink = `mailto:?subject=Kochduell Infos&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
}