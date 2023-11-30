const searchField = document.querySelector("#city-search-input");
const searchButton = document.querySelector("#search-button");

function searchCity(city) {
    console.log(city)
}

function addToSearchHistory(query) {
    var historyButton = document.createElement("button");
    historyButton.className = "history-button btn btn-outline-secondary";
    historyButton.textContent = (query);
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

