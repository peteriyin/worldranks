"use strict";
const userSearchInput = document.getElementById("search");
const selectItem = document.getElementById("select");
const buttons = document.querySelectorAll("button");
const tableData = document.getElementById("tableData");
const countryStatus = document.getElementById("countrystatus");
const countryCount = document.getElementById("country-count");
const countrySpellCheck = document.getElementById("country-spell-check");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const checkboxesChecked = document.querySelectorAll("input[type=checkbox]:checked");
const checkmark1 = document.getElementById("checkmark_1");
const checkmark2 = document.getElementById("checkmark_2");

function renderCountryData(countries) {
    if (countries.length == 0) {
        countryStatus.textContent = "No Countries Found"
    }
    countryCount.textContent = countries.length;
    countrySpellCheck.textContent = countries.length >= 2 ? "Countries" : "Country";
    const tableHtml = `
          <table class="min-w-200">
          <thead>
            <tr>
             <th>Flag</th>
             <th>Name</th>
             <th>Population</th>
             <th>Area (km<sup>2</sup>)</th>
             <th>Region</th>
            </tr>
          </thead>
          <tbody>
          ${countries.map(country => `
        <tr>
            <td>
                <img
                    src="${country.flags.svg}"
                    alt="${country.name.common}"
                    width="55px"
                    class="rounded-sm"
                />
            </td>
            <td class="max-w-20 text-wrap pr-2">${country.name.common}</td>
            <td>${country.population.toLocaleString('en-US')}</td>
            <td>${country.area.toLocaleString('en-US')}</td>
            <td>${country.region}</td>
        </tr>
        `).join("")}
          </tbody>
        </table>`
    tableData.insertAdjacentHTML('afterbegin', tableHtml);
}

function searchFilter(countryList) {
    userSearchInput.addEventListener('keyup', (event) => {
        const searchItem = event.target.value.trim().toLowerCase();
        const searchInput = countryList.filter((item) =>
            item.name.common.toLowerCase().includes(searchItem)
        )
        tableData.innerHTML = ""
        renderCountryData(searchInput)
    })
}

function sortWithSelectElements(countryList) {
    selectItem.addEventListener('change', (event) => {
        const selectedOption = event.target.value
        if (selectedOption === "population") {
            countryList.sort((a, b) => b.population - a.population)
            tableData.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "name") {
            countryList.sort((a, b) => a.name.common.localeCompare(b.name.common))
            tableData.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "region") {
            countryList.sort((a, b) => a.region > b.region ? 1 : -1)
            tableData.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "subregion") {
            countryList.sort((a, b) => a.subregion > b.subregion ? 1 : -1)
            tableData.innerHTML = ""
            renderCountryData(countryList);
        }
    })
}

function filterRegionsWithButtons(countryList) {
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const selectedButton = event.target.value
            if (selectedButton === "antarctic") {
                const antarctic = countryList.filter((item) => item.region === "Antarctic")
                tableData.innerHTML = ""
                renderCountryData(antarctic)
            }
            else if (selectedButton === "americas") {
                const americas = countryList.filter((item) => item.region === "Americas")
                tableData.innerHTML = ""
                renderCountryData(americas)
            }
            else if (selectedButton === "asia") {
                const asia = countryList.filter((item) => item.region === "Asia")
                tableData.innerHTML = ""
                renderCountryData(asia)
            }
            else if (selectedButton === "africa") {
                const africa = countryList.filter((item) => item.region === "Africa")
                tableData.innerHTML = ""
                renderCountryData(africa)
            }
            else if (selectedButton === "europe") {
                const europe = countryList.filter((item) => item.region === "Europe")
                tableData.innerHTML = ""
                renderCountryData(europe)
            }
            else if (selectedButton === "oceania") {
                const oceania = countryList.filter((item) => item.region === "Oceania")
                tableData.innerHTML = ""
                renderCountryData(oceania)
            }
        })
    })
}

function filterStatusWithCheckbox(countryList) {
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            const checkedItem = event.target.value;
            if (checkbox.checked && checkedItem === "united_nations") {
                checkmark1.classList.add("checkbox")
                const unitedNations = countryList.filter((item) => item.unMember == true)
                tableData.innerHTML = ""
                renderCountryData(unitedNations)
            } else if (checkbox.checked && checkedItem === "independent") {
                checkmark2.classList.add("checkbox")
                const indePendent = countryList.filter((item) => item.independent == true)
                tableData.innerHTML = ""
                renderCountryData(indePendent)
            } else if (!checkbox.checked && checkedItem === "united_nations") {
                checkmark1.classList.remove("checkbox")
            }
            else if (!checkbox.checked && checkedItem === "independent") {
                checkmark2.classList.remove("checkbox")
            }
        })
    })
}

async function getCountrydata() {
    const url = "https://restcountries.com/v3.1/all?fields=name,flags,population,area,region,subregion,independent,unMember"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`error received: ${response.status} error`)
        }
        const result = await response.json();
        result.sort((a, b) => b.population - a.population);
        console.log(result);
        sortWithSelectElements(result);
        renderCountryData(result);
        filterRegionsWithButtons(result);
        filterStatusWithCheckbox(result);
        searchFilter(result);
    }
    catch (error) {
        countryStatus.textContent = "Error fetching data"
        console.log(error.message);
    }
}
getCountrydata()