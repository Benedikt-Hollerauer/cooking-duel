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

    const members = Array.from(document.querySelectorAll('#members input')).map(input => input.value);
    const selectedDishes = getSelectedValuesFromInputCheckboxes("which");
    const allCountries = getCountriesFromName("all");
    const uniqueCountries = [];

    if (firstCountrySelection.value === "Zufallsauswahl") {
        members.forEach(() => {
            let randomCountry;
            do {
                randomCountry = getRandomItem(allCountries);
            } while (uniqueCountries.includes(randomCountry));
            uniqueCountries.push(randomCountry);
        });
    } else {
        uniqueCountries.push(
            thirdSelection.style.display !== 'none' ? thirdSelection.value :
            secondSelection.style.display !== 'none' ? secondSelection.value :
            firstCountrySelection.value === 'Auswählen' ? "Deutschland" : firstCountrySelection.value
        );
    }

    const assignments = [];
    for (let i = 0; i < Math.max(members.length, selectedDishes.length); i++) {
        assignments.push({
            member: members[i % members.length],
            dish: selectedDishes[i % selectedDishes.length],
            country: uniqueCountries[i % uniqueCountries.length]
        });
    }

    formDataObj['assignments'] = assignments;

    // Include additional details in the summary
    formDataObj['location'] = formDataObj['location'] || "Nicht angegeben";
    formDataObj['when'] = formDataObj['when'] || "Nicht angegeben";
    formDataObj['what-has-to-be-done'] = getSelectedValuesFromInputCheckboxes("what-has-to-be-done");

    state.summary = formDataObj;
    renderSummary();
}

function renderSummary() {
    const summaryDiv = document.getElementById('summary');
    const summaryWrapperDiv = document.getElementById("summary-wrapper");
    const form = document.getElementById('regForm');
    summaryDiv.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Teilnehmer', 'Gericht', 'Land'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    state.summary.assignments.forEach(assignment => {
        const row = document.createElement('tr');

        const memberCell = document.createElement('td');
        memberCell.textContent = assignment.member;
        row.appendChild(memberCell);

        const dishCell = document.createElement('td');
        dishCell.textContent = assignment.dish;
        row.appendChild(dishCell);

        const countryCell = document.createElement('td');
        countryCell.textContent = assignment.country;
        row.appendChild(countryCell);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    summaryDiv.appendChild(table);

    // Format the date
    const formattedDate = new Date(state.summary.when).toLocaleString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Add additional details below the table
    const detailsDiv = document.createElement('div');
    detailsDiv.innerHTML = `
        <p><strong>Standort:</strong> ${state.summary.location}</p>
        <p><strong>Wann:</strong> ${formattedDate}</p>
        <p><strong>Was muss getan werden:</strong> ${state.summary['what-has-to-be-done'].join(', ')}</p>
    `;
    summaryDiv.appendChild(detailsDiv);

    form.style.display = "none";
    summaryWrapperDiv.style.display = "flex";
}

function openEmailWithSummary() {
    let emailBody = 'Zusammenfassung:\n\n';
    state.summary.assignments.forEach(assignment => {
        emailBody += `Teilnehmer: ${assignment.member}\nGericht: ${assignment.dish}\nLand: ${assignment.country}\n\n`;
    });
    emailBody += `Standort: ${state.summary.location}\n`;
    emailBody += `Wann: ${new Date(state.summary.when).toLocaleString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}\n`;
    emailBody += `Was muss getan werden: ${state.summary['what-has-to-be-done'].join(', ')}\n`;

    const mailtoLink = `mailto:?subject=Kochduell Infos&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
}