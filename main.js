const HOME = document.getElementById("home")
const COUNTRY_FILTER = document.getElementById("country-filter")
const REGION_FILTER = document.getElementById("region-filter")
const COUNTRY_INPUT = COUNTRY_FILTER.querySelector("input")
const REGION_INPUT = REGION_FILTER.querySelector("select")
const RETURN_BUTTON = document.getElementById("return")

COUNTRY_FILTER.addEventListener("change", filterCountries)
REGION_FILTER.addEventListener("change", filterCountries)

window.addEventListener('load', async () => {
    const DATA = await getData()
    displayCountries(DATA)
});

getAllRegions()

async function getData() {
    const response = await fetch("./data.json")
    const data = await response.json()
    return await data;
}

async function getAllRegions() {
    const data = await getData()
    let regions = [];

    data.forEach(country => {
        !regions.includes(country.region) ? regions.push(country.region) : false;
    });

    regions.sort()

    const SELECT = REGION_FILTER.querySelector("select")

    regions.forEach(region => {
        const option = document.createElement("option")
        option.text = region;
        option.setAttribute("value", region.toLowerCase())

        SELECT.add(option)
    })
}

async function filterByRegion(region) {
    const data = await getData()
    let countries = []
    
    data.forEach(country => {
        country.region.toLowerCase() == region ? countries.push(country) : false
    })

    return countries;
}

async function filterByCountryName(countryName, countries) {
    let filteredCountry = []

    countries.forEach(country => {
        if(country.name.toLowerCase().includes(countryName.toLowerCase())) {
            filteredCountry.push(country)
        }
    })
    return filteredCountry
}

async function filterCountries() {
    const COUNTRY = COUNTRY_INPUT.value
    const REGION = REGION_INPUT.value

    let region = null;
    let country = null;

    if(REGION) {
        region = await filterByRegion(REGION)
    }

    if(COUNTRY) {
        if(region) {
            country = await filterByCountryName(COUNTRY, region)
        } else {
            region = await getData()
            country = await filterByCountryName(COUNTRY, region)
        }
    } else {
        if(!region) {
            country = await getData()
        } else {
            country = region;
        }
    }

    displayCountries(country)
}

function displayCountries(countries) {
    const RESULTS = document.getElementById("results")
    RESULTS.innerHTML = ""

    countries.forEach(country => {
        const COUNTRY = document.createElement("div")
        COUNTRY.classList.add("country", "shadow")

        const IMG =  document.createElement("img")
        IMG.setAttribute("src", country.flag)
        IMG.setAttribute("alt", `${country.name} Flag`)

        const CONTENT = document.createElement("div")
        CONTENT.classList.add("content")

        const COUNTRY_NAME = document.createElement("h1")
        COUNTRY_NAME.classList.add("country-name")
        COUNTRY_NAME.innerText = country.name

        const POPULATION = document.createElement("p")
        POPULATION.classList.add("population")
        POPULATION.innerText = country.population.toLocaleString()

        const REGION = document.createElement("p")
        REGION.classList.add("region")
        REGION.innerText = country.region

        const CAPITAL = document.createElement("p")
        CAPITAL.classList.add("capital")
        CAPITAL.innerText = country.name

        CONTENT.appendChild(COUNTRY_NAME)
        CONTENT.appendChild(POPULATION)
        CONTENT.appendChild(REGION)
        CONTENT.appendChild(CAPITAL)

        COUNTRY.appendChild(IMG)
        COUNTRY.appendChild(CONTENT)
        COUNTRY.dataset.countryName = country.name
        RESULTS.appendChild(COUNTRY)

        COUNTRY.addEventListener("click", () => showCountryDetails(COUNTRY.dataset.countryName))
    })
}

// Details section
const COUNTRY_DETAILS = document.getElementById("country-details")
const COUNTRY_DETAILS_FLAG = COUNTRY_DETAILS.querySelector("#country-flag img")
const COUNTRY_DETAILS_NAME = COUNTRY_DETAILS.querySelector("#country-name")
const COUNTRY_DETAILS_NATIVE_NAME = COUNTRY_DETAILS.querySelector(".native-name")
const COUNTRY_DETAILS_POPULATION = COUNTRY_DETAILS.querySelector(".population")
const COUNTRY_DETAILS_REGION = COUNTRY_DETAILS.querySelector(".region")
const COUNTRY_DETAILS_SUB_REGION = COUNTRY_DETAILS.querySelector(".sub-region")
const COUNTRY_DETAILS_CAPITAL = COUNTRY_DETAILS.querySelector(".capital")
const COUNTRY_DETAILS_TOP_LEVEL_DOMAIN = COUNTRY_DETAILS.querySelector(".top-level-domain")
const COUNTRY_DETAILS_CURRENCIES = COUNTRY_DETAILS.querySelector(".currencies")
const COUNTRY_DETAILS_LANGUAGES = COUNTRY_DETAILS.querySelector(".languages")
const COUNTRY_DETAILS_BORDERS = COUNTRY_DETAILS.querySelector("#border-countries")

RETURN_BUTTON.addEventListener("click", () => showDetails(false))

async function showCountryDetails(countryName) {
    const data = await getData()
    const countries = await filterByCountryName(countryName, data)
    const country = countries[0]
    
    COUNTRY_DETAILS_FLAG.src = country.flag
    COUNTRY_DETAILS_NAME.innerText = country.name
    COUNTRY_DETAILS_NATIVE_NAME.innerText = country.nativeName
    COUNTRY_DETAILS_POPULATION.innerText = country.population.toLocaleString()
    COUNTRY_DETAILS_REGION.innerText = country.region
    COUNTRY_DETAILS_SUB_REGION.innerText = country.subregion
    COUNTRY_DETAILS_CAPITAL.innerText = country.capital
    COUNTRY_DETAILS_TOP_LEVEL_DOMAIN.innerText = country.topLevelDomain.join(" ")
    COUNTRY_DETAILS_CURRENCIES.innerText = country.currencies.map((c) => c.name).join(", ")
    COUNTRY_DETAILS_LANGUAGES.innerText = country.languages.map((c) => c.name).join(", ")

    if(country.borders) {
        const borderCountries = COUNTRY_DETAILS_BORDERS.querySelector("#countries")
        const borders = await getBorderCountries(country.borders)

        borderCountries.innerHTML = ''

        borders.forEach(border => {
            const div = document.createElement("div")
            div.classList.add("country")
            div.innerText = border
            div.addEventListener("click", () => showCountryDetails(border))
            borderCountries.appendChild(div)
        })

        COUNTRY_DETAILS_BORDERS.style.display = "flex"
    }

    console.log(country)
    showDetails(true)
}

async function getBorderCountries(borders) {
    const data = await getData()
    let borderCountries = []
    data.forEach(country => borders.includes(country.alpha3Code) ? borderCountries.push(country.name) : false)
    
    return borderCountries;
}

function showDetails(show) {
    if(show) {
        HOME.style.display = "none"
        COUNTRY_DETAILS.style.display = "flex"
    } else {
        HOME.style.display = "flex"
        COUNTRY_DETAILS.style.display = "none"
    }
}