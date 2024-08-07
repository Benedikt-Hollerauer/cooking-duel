let currentTab = 0;
const state = { summary: {} };

showTab(currentTab);

function showTab(n) {
    const tabs = document.getElementsByClassName("tab");
    tabs[n].style.display = "block";
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
    fixStepIndicator(n);
}

function nextPrev(n) {
    const tabs = document.getElementsByClassName("tab");
    if (n === 1 && !validateForm()) return false;
    tabs[currentTab].style.display = "none";
    currentTab += n;
    if (currentTab >= tabs.length) {
        createSummary();
        return false;
    }
    showTab(currentTab);
}

function validateForm() {
    const tabs = document.getElementsByClassName("tab");
    const inputs = tabs[currentTab].getElementsByTagName("input");
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            inputs[i].className += " invalid";
            valid = false;
        }
    }
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid;
}

function fixStepIndicator(n) {
    const steps = document.getElementsByClassName("step");
    for (let i = 0; i < steps.length; i++) {
        steps[i].className = steps[i].className.replace(" active", "");
    }
    steps[n].className += " active";
}

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
};

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

function getCountriesFromName(region) {
    const german = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];
    const europa = ["Deutschland", "Skandinavien", "Polen", "Be-Ne-Lux", "Großbritannien", "Österreich/Schweiz", "Spanien/Portugal", "Italien", "Griechenland", "Balkan", "Frankreich", "Tschechien/Slowakei", "Ungarn/Rumänien"];
    const international = ["Afrika", "Asien", "Ozeanien", "Nordamerika", "Südamerika"];
    const southernAmerica = ["Brasilien", "Argentinien", "Kolumbien", "Chile", "Paraguay"];
    const northernAmerica = ["USA", "Mexiko", "Kanada", "Kuba", "Jamaika"];
    const ociania = ["Australien", "Fidschi", "Neuseeland"];
    const asia = ["China", "Japan", "Indien", "Russland", "VAE", "Türkei"];
    const africa = ["Marokko", "Ägypten", "Südafrika", "Mittelafrika", "Madagaskar"];
    const all = german.concat(europa, southernAmerica, northernAmerica, ociania, asia, africa);

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
        case "all":
            return all;
        default:
            return europa;
    }
}

function secondSelectFill(firstSelectId, secondSelectId) {
    const firstSelect = document.getElementById(firstSelectId);
    const secondSelect = document.getElementById(secondSelectId);
    secondSelect.innerHTML = '';
    const selectedValue = firstSelect.value;
    if (selectedValue && selectedValue != "Zufallsauswahl") {
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
    if (firstSelectValue == "International") {
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
    const checkboxes = document.querySelectorAll('input[name="' + inputName + '"]:checked');
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
    return selectedValues;
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function createSummary() {
    const formData = new FormData(document.getElementById('regForm'));
    const formDataObj = Object.fromEntries(formData);
    const thirdSelection = document.getElementById('third-country-selection');
    const secondSelection = document.getElementById('further-country-selection');
    const firstCountrySelection = document.getElementById('country-selection');

    if (firstCountrySelection.value === "Zufallsauswahl") {
        const allCountries = getCountriesFromName("all");
        const uniqueCountries = [];
        const members = Array.from(document.querySelectorAll('#members input')).map(input => input.value);

        members.forEach(() => {
            let randomCountry;
            do {
                randomCountry = getRandomItem(allCountries);
            } while (uniqueCountries.includes(randomCountry));
            uniqueCountries.push(randomCountry);
        });

        formDataObj['country-selection'] = uniqueCountries;
    } else {
        formDataObj['country-selection'] = thirdSelection.style.display !== 'none' ? thirdSelection.value :
            secondSelection.style.display !== 'none' ? secondSelection.value :
                firstCountrySelection.value === 'Auswählen' ? "Deutschland" : firstCountrySelection.value;
    }

    formDataObj['members'] = Array.from(document.querySelectorAll('#members input')).map(input => input.value);
    formDataObj['what-has-to-be-done'] = getSelectedValuesFromInputCheckboxes("what-has-to-be-done");
    formDataObj['which'] = getSelectedValuesFromInputCheckboxes("which");

    state.summary = formDataObj;
    renderSummary();
}

function renderSummary() {
    const summaryDiv = document.getElementById('summary');
    const summaryWrapperDiv = document.getElementById("summary-wrapper");
    const form = document.getElementById('regForm');
    summaryDiv.innerHTML = '';

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

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
    summaryDiv.appendChild(table);

    form.style.display = "none";
    summaryWrapperDiv.style.display = "flex";
}

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