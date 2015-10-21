Meteor.startup(function () {
  console.log("The Simple Dashboard app started up.");
});

Meteor.methods({
  getWeather: function(lat, lng) {
    console.log("called getWeather with ", lat, lng);
    // make a call to the forecast api but ONLY if it's been at least five minutes since the last call
    // TODO: have a collection of cached weather data the check first
    var apiUrl = "https://api.forecast.io/forecast/" + API_KEY_FORECAST + "/" + lat + "," + lng;
    var weather = HTTP.get(apiUrl, {params: {data: "JSONP"}});
    weather = JSON.parse(weather.content);
    return weather;
  }
})
