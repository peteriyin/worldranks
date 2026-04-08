"use strict";
const userSearchInput = document.getElementById("search");
const selectItem = document.getElementById("select");
const buttons = document.querySelectorAll("button");
const tableBody = document.getElementById("tableBody");
const countriesFound = document.getElementById("countrystatus");
const countryCount = document.getElementById("country-count");
const countrySpellCheck = document.getElementById("country-spell-check");
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const checkboxesChecked = document.querySelectorAll("input[type=checkbox]:checked");
const checkmark1 = document.getElementById("checkmark1");
const checkmark2 = document.getElementById("checkmark_2");
const svgs = document.querySelectorAll('.checkmarks');

// function renderAnimationPulse() {
//     const tableDataAnimation = `
//         <tbody>
//             <tr class="animate-pulse">
//                 <td class="flex items-center justify-center w-10.75 h-11 bg-neutral-quaternary rounded-base">
//                     <svg class="w-11 h-11 text-fg-disabled" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
//                     </svg>
//                 </td>
//                 <td><div class="h-4 bg-gray-500 rounded-full w-20 inline-block">&nbsp;</div></td>
//                 <td><div class="h-4 bg-neutral-quaternary rounded-full w-24">hfh</div></td>
//                 <td><div class="h-4 bg-neutral-quaternary rounded-full w-19">hgh</div></td>
//                 <td><div class="h-4 bg-neutral-quaternary rounded-full w-16">hgh</div></td> 
//             </tr>
//         </tbody>`
//     tableData.insertAdjacentHTML("beforeend", tableDataAnimation)
// }
// renderAnimationPulse()

function renderCountryData(countries) {
    if (countries.length == 0) {
        countriesFound.textContent = "No Countries Found"
    }
    countryCount.textContent = countries.length;
    countrySpellCheck.textContent = countries.length >= 2 ? "Countries" : "Country";
    const tableHtml = `
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
  `
    tableBody.insertAdjacentHTML("afterbegin", tableHtml);
}

function searchFilter(countryList) {
    userSearchInput.addEventListener('keyup', (event) => {
        const searchItem = event.target.value.trim().toLowerCase();
        const searchInput = countryList.filter((item) =>
            item.name.common.toLowerCase().includes(searchItem)
        )
        tableBody.innerHTML = ""
        renderCountryData(searchInput)
    })
}

function sortWithSelectElements(countryList) {
    selectItem.addEventListener('change', (event) => {
        const selectedOption = event.target.value
        if (selectedOption === "population") {
            countryList.sort((a, b) => b.population - a.population)
            tableBody.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "name") {
            countryList.sort((a, b) => a.name.common.localeCompare(b.name.common))
            tableBody.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "region") {
            countryList.sort((a, b) => a.region > b.region ? 1 : -1)
            tableBody.innerHTML = ""
            renderCountryData(countryList);
        } else if (selectedOption === "subregion") {
            countryList.sort((a, b) => a.subregion > b.subregion ? 1 : -1)
            tableBody.innerHTML = ""
            renderCountryData(countryList);
        }
    })
}

let activeRegions = [];

function filterRegionsWithButtons(countryList) {
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const currentBtn = event.currentTarget;
            const regionValue = currentBtn.value.toLowerCase();

            if (activeRegions.includes(regionValue)) {
                activeRegions = activeRegions.filter(r => r !== regionValue);
                currentBtn.classList.remove('active');
            } else {
                activeRegions.push(regionValue);
                currentBtn.classList.add('active');
            }

            let filteredData;

            if (activeRegions.length === 0) {
                filteredData = countryList;
            } else {
                filteredData = countryList.filter(country =>
                    activeRegions.includes(country.region.toLowerCase())
                );
            }
            tableBody.innerHTML = "";
            renderCountryData(filteredData);
        });
    });
}

let countryStatus = [];
function filterStatusWithCheckbox(countries) {
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("click", (event) => {
            const currentCheckbox = event.currentTarget;
            const checkBoxValue = currentCheckbox.value;

            svgs.forEach(svg => {
                if (countryStatus.includes(checkBoxValue) && svg.id == checkBoxValue) {
                    countryStatus = countryStatus.filter(x => x != checkBoxValue)
                    svg.classList.remove("checkbox");

                } else if (!countryStatus.includes(checkBoxValue) && svg.id == checkBoxValue) {
                    countryStatus.push(checkBoxValue)
                    svg.classList.add("checkbox");

                }
            })
            let checkListedData;

            if (countryStatus.length == 0) {
                checkListedData = countries;
            } else {
                checkListedData = countries.filter(status => {
                    return countryStatus.every(x => status[x])
                })
            }
            tableBody.innerHTML = "";
            renderCountryData(checkListedData);
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

        renderCountryData(result);
        sortWithSelectElements(result);
        filterRegionsWithButtons(result);
        filterStatusWithCheckbox(result);
        searchFilter(result);
    }
    catch (error) {
        countriesFound.textContent = "Error fetching data"
        console.log(error.message);
    }
}
getCountrydata()