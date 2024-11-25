// import dotenv from "dotenv";
// dotenv.config();

//lien API météeo et stockage de l'API dans une variable nommée "params"
const weatherCity = {
    API_URL: "https://api.openweathermap.org/data/2.5/weather",
    API_KEY: "44d8fdd28be4caca3846543e50d7b5e0",
    units: "metric",
}
console.log(weatherCity);

const listCity = {
    API_URL: "https://api.openweathermap.org/geo/1.0/direct",
    API_KEY: "44d8fdd28be4caca3846543e50d7b5e0",
    limit: 10,
}

console.log(listCity);

//variable de chemin
const cityInput = document.getElementById("city");
const list = document.getElementById("myDropdown");
const buttonClick = document.getElementById("button")


// fonction pour fetch l'API de la liste deroulante
async function listCities (query) {

    try {
        const response = await fetch(`${listCity.API_URL}?q=${query}, &limit=${listCity.limit}&appid=${listCity.API_KEY}`);

        if (!response.ok) {
            throw new Error("La ville n'a pas été trouvée");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur API")
        list.innerHTML = "Aucun resultat"
        list.style.display = "block";
    }
}


//fonction pour fetch les données météo
// async function getWeather(query) {
//
//     try {
//         const response = await fetch(`${weatherCity.API_URL}?q=${query}&appid=${weatherCity.API_KEY}&units=${weatherCity.units}`);
//
//         if (!response.ok) {
//             throw new Error("La ville n'a pas été trouvée");
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Erreur API");
//     }
// }

// forEach qui permet de créer une liste de villes qui correspondent à l'input client
function displayCities(cities){
    list.innerHTML = "";
    cities.forEach(city => {
        const op = document.createElement("option");
        op.textContent = `${city.name}, ${city.country}, ${city.state}`;
        list.appendChild(op);
    });
    list.style.display = "block";
}

//fonction pour afficher les données météo
// function DisplayWeather (){
// }

//event qui filtre la liste lors de l'input du client
cityInput.addEventListener("keyup", async (event) => {
    const query = event.target.value
    if (query.length >= 3) {
        const cities = await listCities(query);
        displayCities(cities);
    }
});


//event pour afficher la météo en cliquant sur le bouton
// buttonClick.addEventListener("click", async (event) => {
//     const weather = await getWeather(event);
// })