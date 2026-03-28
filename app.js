"use strict";
const userSearchInput = document.getElementById("search");
const userSelect = document.getElementById("select");
const buttons = document.querySelectorAll("button");
const tableData = document.getElementById("tableData");

function renderCountryData(countries) {
    const tableHtml = `
          <table class="min-w-200 ">
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
            <td class="w-62.5 text-wrap">${country.name.common}</td>
            <td>${country.population.toLocaleString('en-US')}</td>
            <td>${country.area.toLocaleString('en-US')}</td>
            <td>${country.region}</td>
        </tr>
        `).join("")}
          </tbody>
        </table>`
    tableData.insertAdjacentHTML('afterbegin', tableHtml);
}

async function getCountrydata() {
    const url = "https://restcountries.com/v3.1/all?fields=name,flags,population,area,region,subregion,independent"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`error received: ${response.status} error`)
        }
        const result = await response.json();
        console.log(result);
        renderCountryData(result);
    }
    catch (error) {
        console.log(error.message);
    }
}
getCountrydata()