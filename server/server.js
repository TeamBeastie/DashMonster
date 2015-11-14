
Meteor.startup(function () {
  console.log("The Simple Dashboard app started up.");
});

Meteor.methods({
  getWeather: function(lat, lng) {
    this.unblock();
    // console.log("called getWeather with ", lat, lng);
    // make a call to the forecast api but ONLY if it's been at least five minutes since the last call
    // TODO: have a collection of cached weather data the check first
    var apiUrl = "https://api.forecast.io/forecast/" + API_KEY_FORECAST + "/" + lat + "," + lng;
    var weather = HTTP.get(apiUrl, {params: {data: "JSONP"}});
    return weather.content;
  },
  // takes a stopId and route, returns entire result of the TriMet API call
  // as JSON text.
  getArrivals: function(stopId) {
    this.unblock();
    var apiUrl = "https://developer.trimet.org/ws/v2/arrivals/json/true/locIDs/" + stopId + "/arrivals/3/appID/" + API_KEY_TRIMET;
    var info = HTTP.get(apiUrl);
    return info.content;
  },
  getBusLines: function() {
    this.unblock();
    var apiUrl = "https://developer.trimet.org/ws/V1/routeConfig/json/true/appid/" + API_KEY_TRIMET;
    var info = HTTP.get(apiUrl);
    return info.content;
  },
  getDirectionsForLine: function(route) {
    this.unblock();
    var apiUrl = "https://developer.trimet.org/ws/V1/routeConfig/routes/" + route + "/json/true/dir/true/appid/" + API_KEY_TRIMET;
    var info = HTTP.get(apiUrl);
    return info.content;
  },
  getStops: function(route, direction) {
    this.unblock();
    var apiUrl = "https://developer.trimet.org/ws/V1/routeConfig/route/" + route + "/dir/" + direction + "/stops/true/json/true/appid/" + API_KEY_TRIMET;
    var info = HTTP.get(apiUrl);
    return info.content;
  }
})
