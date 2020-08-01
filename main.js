window.onload = function () {
    // get summary button
    const getBtn = document.getElementById('getBtn');
    getBtn.addEventListener('click', getDataofSummary);
    // locate button 
    const locateBtn = document.getElementById('locateBtn');
    locateBtn.addEventListener('click', getDataofcountries);
    // submit button
    const submitBTN = document.getElementById('submitBTN');
    submitBTN.addEventListener('click', getDataOfCountryByDate);
    // check button
    const checkBTN = document.getElementById('checkBTN');
    checkBTN.addEventListener('click', getResponseFromApi);
}

const sendHTTRequest = (method, url) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            resolve(xhr.response);
        };
        xhr.send();
    });
    return promise;
}
const getDataofSummary = () => {
    sendHTTRequest('GET', 'https://api.covid19api.com/summary').then(responseData => {
        const dataSummary = JSON.parse(responseData);
        try {
            var summaryTotalConfirmed = document.getElementById('TotalConfirmed');
            summaryTotalConfirmed.innerHTML = (dataSummary.Global.TotalConfirmed).toLocaleString();
            var summaryTotalRecovered = document.getElementById('TotalRecovered');
            summaryTotalRecovered.innerHTML = (dataSummary.Global.TotalRecovered).toLocaleString();
        }
        catch (err) {
            alert("ERROR: Could not retrieve the data");
        }
    });
};

const getDataofcountries = () => {
    sendHTTRequest('GET', 'https://api.covid19api.com/summary').then(responseData => {
        const dataSummary = JSON.parse(responseData);
        const countryInput = document.getElementById('countryInput').value;
        let foundCountry = search(dataSummary.Countries, countryInput);
        try {
            var countryName = document.getElementById('selectedCountrySpN');
            countryName.innerHTML = foundCountry.Country;
            var totalConfirmed = document.getElementById('totalConfirmedSPN');
            totalConfirmed.innerHTML = (foundCountry.TotalConfirmed).toLocaleString();
            var totalRecovered = document.getElementById('totalRecoveredSPN');
            totalRecovered.innerHTML = (foundCountry.NewRecovered).toLocaleString();

            var date = document.getElementById('dateSPN');
            var dateFormatted = ((foundCountry.Date).substr(0, 10)).split("-").reverse().join("-");
            date.innerHTML = dateFormatted;
        }
        catch (err) {
            alert("ERROR: no such country found");
        }
    });
};
const search = (countriesArray, searchInput) => {
    for (var i = 0; i < countriesArray.length; i++) {
        if (countriesArray[i].Country.toLowerCase() === searchInput.toLowerCase() || countriesArray[i].Slug === searchInput) {
            return countriesArray[i];
        }
    }
};

const getDataOfCountryByDate = () => {
    const fromDate = document.getElementById('fromInput').value;
    const toDate = document.getElementById('toInput').value;
    const countryInput = document.getElementById('countryInputByDate').value;

    if (countryInput == "") {
        alert("error: please enter the country's name");
    }
    else if(isNaN(countryInput) == false) {
        alert("Error: Wrong input, please enter a NAME of a country");
    }
    // else if() {

    // }
    else if (fromDate == "") {
        alert("Error: Please enter a from date");
    }
    else if (toDate == "") {
        alert("Error: please enter a to date");
    }
    else {
        sendHTTRequest('GET', `https://api.covid19api.com/total/country/${countryInput}/status/confirmed?from=${fromDate}&to=${toDate}`).then(responseData => {
            const dataByDate = JSON.parse(responseData);
            var cases = 0;
            for (var i = 0; i < dataByDate.length - 1; i++) {
                cases += Math.abs(dataByDate[i].Cases - dataByDate[i + 1].Cases);
            }
            var totalConfirmedByDate = document.getElementById('totalConfirmedSPN2');
            totalConfirmedByDate.innerHTML = cases.toLocaleString();
        });

        var selectedCoutry2 = document.getElementById('selectedCountrySpN2');
        let countryInputLower = countryInput.toLowerCase();
        selectedCoutry2.innerHTML = countryInputLower.charAt(0).toUpperCase() + countryInputLower.slice(1);
        // change format of dates:
        var fromDateFormatted = fromDate.split("-").reverse().join("-");
        var toDateFormatted = toDate.split("-").reverse().join("-");
        // state the dates:
        var fromDateSPN = document.getElementById('fromDateSPN');
        fromDateSPN.innerHTML = fromDateFormatted;
        var toDateSPN = document.getElementById('toDateSPN');
        toDateSPN.innerHTML = toDateFormatted;
    }
};

const getResponseFromApi = () => {
    let maxNumber = document.getElementById('checkInput').value;
    if (maxNumber == "") {
        alert("Error: please enter a number");
    }
    else if(isNaN(maxNumber) == true) {
        alert("Error: please enter a numeric integer!");
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var checkSPN = document.getElementById('checkSPN');
                checkSPN.innerHTML = this.response.replace(this.response[0],'').replace(this.response[this.response.length - 1],'');
            }
        };
        xhttp.open("GET", `https://localhost:44351/api/GetMaxCovidOcurencies/${maxNumber}`, true);
        xhttp.send();
    }
}
