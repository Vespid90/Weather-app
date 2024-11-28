// import dotenv from "dotenv";
// dotenv.config();

//lien API météo et liste de ville et stockage dans une variable
const weatherCity = {
    API_URL: "https://api.openweathermap.org/data/2.5/forecast",
    API_KEY: "44d8fdd28be4caca3846543e50d7b5e0",
    units: "metric",
};

const listCity = {
    API_URL: "https://api.openweathermap.org/geo/1.0/direct",
    API_KEY: "44d8fdd28be4caca3846543e50d7b5e0",
    limit: 10,
};


//variables de chemin
const cityInput = document.getElementById("city-list");
const list = document.getElementById("myDropdown");
const btnClick = document.getElementById("btn");
const currentTemp = document.getElementById("current-temp");
const currentDesc = document.getElementById("current-desc");
const currentLocation = document.getElementById("current-location");
const currentWeatherIcon = document.getElementById("current-weather-icon");
const forecastTitle = document.getElementById("forecast-title");
const forecastList = document.getElementById("forecast-list");



//fonction pour fetch l'API de la liste deroulante
async function listCities(query) {
    try {
        const response = await fetch(
            `${listCity.API_URL}?q=${query}&limit=${listCity.limit}&appid=${listCity.API_KEY}`
        );

        if (!response.ok) {
            throw new Error("La ville n'a pas été trouvée");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API - Liste des villes :", error);
        list.innerHTML = "Aucun résultat";
        list.style.display = "block";
    }
}

//permet de réinitialiser la page afin de ne rien faire apparaitre avant l'encodage d'une ville
 function clearWeatherDisplay() {
    currentTemp.textContent ="";
    currentDesc.textContent ="";
    currentLocation.textContent ="";
    currentWeatherIcon.src = "";
    currentWeatherIcon.alt = "";
    forecastList.innerHTML = "";
 }

//fonction pour fetch les données météo
async function getWeather(query) {
    try {
        const response = await fetch(
            `${weatherCity.API_URL}?q=${query}&appid=${weatherCity.API_KEY}&units=${weatherCity.units}&lang=fr`
        );

        if (!response.ok) {
            throw new Error("La ville n'a pas été trouvée");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API - Données météo :", error);
    }
}

//forEach qui permet de créer une liste de villes qui correspondent à l'input client
function displayCities(cities) {
    list.innerHTML = "";
    cities.forEach((city) => {
        const op = document.createElement("option");
        op.textContent = `${city.name}, ${city.country}`;
        list.appendChild(op);
    });
}

//météo actuelle
function displayWeather(weather) {
    currentTemp.textContent = `${Math.round(weather.list[0].main.temp)}°C`;
    currentDesc.textContent = weather.list[0].weather[0].description;
    currentLocation.textContent = weather.city.name;

    const currentIconCode = weather.list[0].weather[0].icon;
    const currentIconUrl = `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`;
    currentWeatherIcon.src = currentIconUrl;

    const forecastByDay = groupForecastByDay(weather.list);

    //affiche les previsions
    forecastList.innerHTML = "";
    forecastByDay.forEach((dayForecast) => {
        const li = document.createElement("li");
        li.classList.add("forecast-item");

        const date = new Date(dayForecast.date);
        const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });
        const formattedDate = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });

        const minTemp = Math.min(...dayForecast.temps);
        const maxTemp = Math.max(...dayForecast.temps);

        const iconCode = dayForecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        li.innerHTML = `
            <span class="forecast-date">${dayName} - ${formattedDate}</span>
            <span class="forecast-temps">${Math.round(minTemp)}°C / ${Math.round(maxTemp)}°C</span>
            <img src="${iconUrl}" alt="${dayForecast.weather[0].description}" class="forecast-icon">
        `;

        forecastList.appendChild(li);
    }
    );
    const titleH3 = forecastTitle.textContent = "Prévision sur 5 jours"
    forecastTitle.appendChild(titleH3);
}


function groupForecastByDay(forecastList) {
    const grouped = [];
    forecastList.forEach((forecast) => {
        const date = forecast.dt_txt.split(" ")[0]; //sert à extraire la date
        let dayGroup = grouped.find((group) => group.date === date);
        if (!dayGroup) {
            dayGroup = { date, temps: [], weather: [] };
            grouped.push(dayGroup);
        }
        dayGroup.temps.push(forecast.main.temp);
        dayGroup.weather.push(forecast.weather[0]);
    });
    return grouped;
}



//les divers events
//sert à clear l'interface
window.addEventListener("DOMContentLoaded", () => {
    clearWeatherDisplay();
});

//event qui filtre la liste lors de l'input client
cityInput.addEventListener("keyup", async (event) => {
    const query = event.target.value;
    if (query.length >= 3) {
        const cities = await listCities(query);
        displayCities(cities);
    }
});


//event pour valider la la saisie par la touche Enter
cityInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        //la méthode .trim() sert à enlever les espace avant/après une chaine de caractères
        const query = cityInput.value.trim();
        if (query) {
            const weather = await getWeather(query);
            if (weather) {
                displayWeather(weather);
            }
        }
    }
});

//event qui affiche ka météo en cliquant sur le bouton
btnClick.addEventListener("click", async () => {
    const query = cityInput.value.trim();
    if (query) {
        const weather = await getWeather(query);
        if (weather) {
            displayWeather(weather);
        }
    }
});
