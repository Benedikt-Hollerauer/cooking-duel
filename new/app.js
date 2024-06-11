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
        consoleLogFormData()//document.getElementById("regForm").submit();
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
const dynamicFieldsDiv = document.getElementById('dynamic-fields');

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
        "Bayern",
        "Baden Württemberg",
        "Sachsen",
        "Niedersachsen",
        "Thüringen"
    ]
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
        case "german":
            return german
        case "europa":
            return europa
        case "international":
            return international
        default:
            return europa
    }
}

function secondSelectFill(first, second) {
    const firstSelect = document.getElementById(first);
    const secondSelectContainer = document.getElementById(second);
    const selectedValue = firstSelect.value;

    // Clear the second select container
    secondSelectContainer.innerHTML = '';

    if (selectedValue) {
      const secondSelectElement = document.createElement('select');
      const countries = getCountriesFromName(selectedValue);

      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.text = country;
        secondSelectElement.add(option);
      });

      secondSelectContainer.appendChild(secondSelectElement);
    }
  }

function consoleLogFormData() {
    const form = document.getElementById('regForm');
    const formData = new FormData(form);
    const formDataMap = new Map(formData.entries());

    console.log(Object.fromEntries(formDataMap));
}

//  function getFormData(formId) {
//    const form = document.getElementById(formId);
//    const formData = new FormData(form);
//  
//    // Convert FormData to a plain object
//    const data = {};
//    for (const [key, value] of formData.entries()) {
//      data[key] = value;
//    }
//  
//    return data;
//  }
//
//  const formData = getFormData('regForm');
//console.log(formData);