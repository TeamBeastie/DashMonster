Meteor.startup(function () {
  console.log("The Simple Dashboard app started up.");
});

Meteor.methods({
  getWeather: function(lat, lng) {
    console.log("called getWeather with ", lat, lng);
    return "the data from getWeather!!!"
    // make a call to the forecast api but ONLY if it's been at least five minutes since the last call
    // TODO: have a collection of cached weather data the check first
  }
})
