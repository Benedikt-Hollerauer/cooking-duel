var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        createSummary()//document.getElementById("regForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

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

function getCountriesFromName(region) {
    let german = [
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
    let europa = [
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
    ]
    let international = [
        "Afrika",
        "Asien",
        "Australien",
        "Nordamerika",
        "Russland",
        "Skandinavien",
        "Südamerika"
    ]
    switch(region) {
        case "Deutsch":
            return german
        case "Europäisch":
            return europa
        case "International":
            return international
        default:
            return europa
    }
}

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
    const summaryWrapperDiv = document.getElementById("summary-wrapper")
    form.style.display = "none"
    summaryWrapperDiv.style.display = "flex"
    summaryDiv.innerHTML = '';
    summaryDiv.appendChild(formDataDiv);
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
