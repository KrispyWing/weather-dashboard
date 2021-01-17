var getWeatherData = function(city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=aba5ba8bf6ca29b364deececed3fe28b";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    })
  })
  
}

getWeatherData("Toronto");