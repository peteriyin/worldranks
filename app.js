"use strict";
const userSearchInput = document.getElementById("search");
const userSelect = document.getElementById("select");
const buttons = document.querySelectorAll("button");
const tableData = document.getElementById("tableData");

function renderCountryData(country) {
    const tableHtml = `
          <table class="min-w-150">
          <thead>
            <tr>
              <th class="py-1.5">Flag</th>
              <th>Name</th>
              <th>Population</th>
              <th>Area (km<sup>2</sup>)</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  src="${country[0].flags.png}"
                  alt="${country[0].name.common}"
                  width="55px"
                  class="rounded-sm"
                />
              </td>
              <td>${country[0].name.official}</td>
              <td>${country[0].population.toLocaleString('en-US')}</td>
              <td>${country[0].area.toLocaleString('en-US')}</td>
              <td>${country[0].region}</td>
            </tr>
          </tbody>
        </table>`
    tableData.insertAdjacentHTML('afterbegin', tableHtml);
}

async function getCountrydata() {
    const url = "https://restcountries.com/v3.1/name/italy"
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