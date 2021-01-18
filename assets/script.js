var citySearch = document.querySelector("#search");
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#currentweather");
var currentHeaderEl = document.querySelector("#current-header");
var currentIconEl = document.querySelector("#current-icon");
var currentEl = document.querySelector("#current-container");
var currentTempEl = document.querySelector("#temp");
var currentHumidEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUvEl = document.querySelector("#uv");
var fiveDayHeaderEl = document.querySelector("#fiveday-header");
var fiveDayCardEl = document.querySelector("#fiveday-cards");
var savedCityEl = document.querySelector("#saved-cities");
var savedCities = [];


var getCityData = function(city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=aba5ba8bf6ca29b364deececed3fe28b";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      //console.log(data);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var cityName = data.name;
      //savedCities.push(data.name);
      getFiveDay(lat, lon, cityName);
      
    })
  })
  
};

var getFiveDay = function (lat, lon, cityName) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=aba5ba8bf6ca29b364deececed3fe28b";

  fetch(apiUrl).then(function (response) {
    response.json().then(function(data) {      
      displayCurrent(data, cityName);
      displayFiveDay(data);
    })
  })
};



var searchSubmitHandler = function(event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityData(cityName);
    savedCities.push(cityName);
    saveCity();
    savedCityDisplay();
    cityInputEl.value=""
  } else {
    alert("Please enter a city");
  }
};

var displayCurrent = function(data, cityName) {
 
  //get date from data and convert to MM/DD/YYY format
  var currentDate = new Date(data.current.dt * 1000).toLocaleDateString("en-US");
  
  //get weather iconId and create element for it
  var iconId = data.current.weather[0].icon;
  var weatherIcon = document.createElement("img");
  weatherIcon.src = "https://openweathermap.org/img/wn/" + iconId + ".png";
  
  //clear old content
  currentWeatherEl.textContent = "";

  //add border to current weather section
  currentEl.classList.add("border");
  //show City Name Date and Weather Icon  
  currentHeaderEl.textContent = cityName + " (" + currentDate + ")";
  currentHeaderEl.append(weatherIcon);
  currentWeatherEl.appendChild(currentHeaderEl);
  
  //display current Temp
  var currentTemp = data.current.temp;
  currentTempEl.textContent = "Temperature: " + currentTemp + "°F";

  //display humidity
  var currentHumid = data.current.humidity;
  currentHumidEl.textContent = "Humidty: " + currentHumid + "%";

  //display wind speed
  var currentWind = data.current.wind_speed;
  currentWindEl.textContent = "Wind Speed: " + currentWind + " MPH"

  //display UV index
  var currentUv = data.current.uvi
  var uvBadge = document.createElement("span");
  if (currentUv < 4) {
    uvBadge.classList = "badge bg-success"
  } else if (currentUv < 7) {
    uvBadge.classList = "badge bg-warning"
  }
  else {
    uvBadge.classList =" badge bg-danger"
  }
  uvBadge.textContent = currentUv;  
  currentUvEl.textContent = "UV Index: ";
  currentUvEl.append(uvBadge);
  
};

var displayFiveDay = function(data) {
  //clear old content
  fiveDayCardEl.textContent = "";
  
  //display Header
  fiveDayHeaderEl.textContent = "5-Day Forecast";
  

  // loop through the next 5 days
  for (i = 1; i < 6; i++) {
    
    //convert 5day date
    var fiveDayDate = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
    

    //get five day weather icon
    var iconId = data.daily[i].weather[0].icon;
    var weatherIcon = document.createElement("img");
    weatherIcon.src = "https://openweathermap.org/img/wn/" + iconId + ".png";
    weatherIcon.setAttribute("width", "50");

    //get 5 day temp
    var fiveDayTempEl = document.createElement("div");
    var fiveDayTemp = data.daily[i].temp.day;
    fiveDayTempEl.classList = "pb-2"
    fiveDayTempEl.textContent = "Temp: " + fiveDayTemp + "°F";

    //get 5 day humidity
    var fiveDayHumidEl = document.createElement("div");
    var fiveDayHumid = data.daily[i].humidity;
    fiveDayHumidEl.textContent = "Humidty: " + fiveDayHumid + "%";

  
    var fiveDayCard = document.createElement("div");
    fiveDayCard.classList = "col card p-3 m-3 bg-primary text-white rounded";
    fiveDayCard.innerHTML = "<h5>" + fiveDayDate + "</h5>";
    fiveDayCard.append(weatherIcon);
    fiveDayCard.append(fiveDayTempEl);
    fiveDayCard.append(fiveDayHumidEl);    
    fiveDayCardEl.appendChild(fiveDayCard);
  }
};

var saveCity = function() {
  localStorage.setItem("myCities", JSON.stringify(savedCities));
}

var savedCityDisplay = function() {
  savedCityEl.textContent="";
  var savedCityList = JSON.parse(localStorage.getItem("myCities"));
  for (i=0; i<savedCityList.length; i++) {
    var savedCityItem = document.createElement("button");
    savedCityItem.classList = "btn btn-outline-dark"
    savedCityItem.textContent = savedCityList[i];    
    savedCityEl.append(savedCityItem);
  }
}

var buttonClickHandler = function(event) {
  var cityBtn = event.target.textContent;
  getCityData(cityBtn);
}

citySearch.addEventListener("click", searchSubmitHandler);
savedCityEl.addEventListener("click", buttonClickHandler);
savedCityDisplay();


