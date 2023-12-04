const searchField = document.querySelector("#city-search-input");
const searchButton = document.querySelector("#search-button");

const currentWeather = document.querySelector("#current-weather");

function handleWeather(result) {
    console.log(JSON.stringify(result))
    var header = document.createElement("h3");
    header.textContent = result.name
    var temperature = document.createElement("p");
    temperature.textContent = "Temperature: " + result.main.temp + "F"
    var wind = document.createElement("p")
    wind.textContent = "Wind: " + result.wind.speed + "MPH"
    var humidity = document.createElement("p")
    humidity.textContent = "Humidity: " + result.main.humidity + "%"
    currentWeather.append(header, temperature, wind, humidity)
    currentWeather.setAttribute("style", "width: 60%; visibility:visible;")
}

function handleForecast(result) {   
    console.log(JSON.stringify(result))
}

function searchCity(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=22fa3b502b403d0e2655dc61be08aa70&units=imperial")
    .then(response => response.json())
    .then(json => {
        handleWeather(json)
    })

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=22fa3b502b403d0e2655dc61be08aa70&units=imperial")
    .then(response => response.json())
    .then(json => {
        handleForecast(json.list)
    })
}

function addToSearchHistory(query) {
    var historyButton = document.createElement("button");
    historyButton.className = "history-button btn btn-outline-secondary";
    historyButton.textContent = query;
    historyButton.addEventListener("click", function() {searchCity(this.textContent)})
    document.getElementById("search-history").prepend(historyButton);
}

searchButton.addEventListener("click", function(event) {
    event.preventDefault();

    var cityToSearch = searchField.value;
    searchField.value = null;

    searchCity(cityToSearch)
    addToSearchHistory(cityToSearch)
})

