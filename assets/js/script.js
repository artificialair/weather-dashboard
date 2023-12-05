const searchField = document.querySelector("#city-search-input");
const searchButton = document.querySelector("#search-button");
const searchHistoryArea = document.getElementById("search-history");

const currentWeather = document.querySelector("#current-weather");
const weatherForecast = document.querySelector("#forecast-area");

var searchHistory = [];

searchButton.addEventListener("click", function(event) {
    event.preventDefault();

    var cityToSearch = searchField.value;
    searchField.value = null;

    searchCity(cityToSearch);
    addToSearchHistory(cityToSearch)
})

function searchCity(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=22fa3b502b403d0e2655dc61be08aa70&units=imperial")
    .then(response => response.json())
    .then(json => {
        if (json.cod == 200) displayCurrentWeather(json)
    })

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=22fa3b502b403d0e2655dc61be08aa70&units=imperial")
    .then(response => response.json())
    .then(json => {
        if (json.cod == 200) handleForecast(json.list);
    })
}

function addToSearchHistory(query) {
    if (searchHistory.includes(query)) {
        searchHistory.splice(searchHistory.indexOf(query), 1)
    }
    searchHistory.push(query)
    if (searchHistory.length > 8) {
        searchHistory.splice(0, 1);
    }
    localStorage.setItem("search-history", JSON.stringify(searchHistory))
    displaySearchHistory();
}

function displaySearchHistory() {
    searchHistoryArea.innerHTML = null
    for (var query of searchHistory) {
        var historyButton = document.createElement("button");
        historyButton.className = "history-button btn btn-outline-secondary";
        historyButton.textContent = query;
        historyButton.addEventListener("click", function() {searchCity(this.textContent)})
        searchHistoryArea.prepend(historyButton);
    }
}

// Convert Weather API response into document elements
function displayCurrentWeather(result) {
    var header = document.createElement("h3");
    var weatherIcon = document.createElement("img");
    var temperature = document.createElement("p");
    var wind = document.createElement("p");
    var humidity = document.createElement("p");

    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + result.weather[0].icon + ".png")
    weatherIcon.setAttribute("style", "width: 50px; height: 50px;")

    header.textContent = result.name + " (" + dayjs.unix(result.dt).format('MM/DD/YYYY') + ")";
    temperature.textContent = "Temp: " + result.main.temp + "F";
    wind.textContent = "Wind: " + result.wind.speed + "MPH";
    humidity.textContent = "Humidity: " + result.main.humidity + "%";

    currentWeather.innerHTML = null
    currentWeather.append(header, weatherIcon, temperature, wind, humidity)
    currentWeather.setAttribute("style", "visibility:visible;")
}

function displayWeatherForecast(results) {
    var title = document.createElement("h4");
    title.innerHTML = "5-Day Forecast"
    var grid = document.createElement("div");
    grid.className = "row";
    for (var date in results) {
        var cardContainer = document.createElement("div");
        var card = document.createElement("div");
        var cardBody = document.createElement("div");
        var header = document.createElement("h5");
        var weatherIcon = document.createElement("img");
        var temperature = document.createElement("p");
        var wind = document.createElement("p");
        var humidity = document.createElement("p");

        cardContainer.className = "col-sm-6"
        card.className = "card text-white bg-primary"
        cardBody.className = "card-body"
        header.className = "card-title"
        temperature.className = "card-text"
        wind.className = "card-text"
        humidity.className = "card-text"

        cardContainer.setAttribute("style", "width: 20%;")
        weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + results[date].weather[0].icon + ".png")
        weatherIcon.setAttribute("style", "width: 50px; height: 50px;")

        header.textContent = dayjs.unix(results[date].dt).format('MM/DD/YYYY');
        temperature.textContent = "Temp: " + results[date].main.temp + "F";
        wind.textContent = "Wind: " + results[date].wind.speed + "MPH";
        humidity.textContent = "Humidity: " + results[date].main.humidity + "%";

        cardBody.append(header, weatherIcon, temperature, wind, humidity)
        card.append(cardBody)
        cardContainer.append(card)
        grid.append(cardContainer)
    }
    weatherForecast.innerHTML = null
    weatherForecast.append(title, grid)
    weatherForecast.setAttribute("style", "visibility:visible;")
}

function handleForecast(result) {   
    var todayDate = dayjs().date()
    var dailyForecasts = {};
    for (var forecast of result) {
        var date = dayjs.unix(forecast.dt).date();
        if (date in dailyForecasts || date === todayDate || forecast.sys.pod === "n") {
            continue
        } else {
            dailyForecasts[date] = forecast
        };
    }
    displayWeatherForecast(dailyForecasts)
}

function init() {
    searchHistory = JSON.parse(localStorage.getItem("search-history"))
    if (searchHistory === null) searchHistory = []
    console.log(searchHistory);
    displaySearchHistory();
}

init();
