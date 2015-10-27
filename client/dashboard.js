var intervalTime;
var intervalFetchArrivals;
var intervalUpdateETAs; // recompute ETAs based on new Date() vs. last fetched ETAs
var intervalWeather;

// how frequently to fetch and/or update our data?
const TIMEOUT_FETCH_ARRIVALS = 30 * 1000;
const TIMEOUT_FETCH_WEATHER = 15 * 60 * 1000;
const TIMEOUT_UPDATE_ETAS = 5 * 1000;

Template.dashboard.onCreated(function() {
  console.log("Dashboard Template created");
  var tmpl = this;
  Session.set("now", new Date());
  Session.setDefault('etas', {});
  Session.setDefault('trimet', {});
  intervalTime = Meteor.setInterval(function() {
    Session.set("now", new Date());
  }, 1000);
  intervalWeather = Meteor.setInterval(function() {
    getWeather();
  }, TIMEOUT_FETCH_WEATHER);
  getAllArrivals(tmpl);
  intervalFetchArrivals = Meteor.setInterval(function() {
    getAllArrivals(tmpl);
  }, TIMEOUT_FETCH_ARRIVALS);
  intervalUpdateETAs = Meteor.setInterval(function() {
    updateETAs();
  }, TIMEOUT_UPDATE_ETAS)
})

Template.dashboard.onRendered(function() {
  console.log("Dashboard Template rendered");
})

Template.dashboard.onDestroyed(function() {
  console.log("Dashboard Template destroyed");
  Meteor.clearInterval(intervalTime);
  Meteor.clearInterval(intervalFetchArrivals);
  Meteor.clearInterval(intervalWeather);
  Meteor.clearInterval(intervalUpdateETAs);
})

Template.dashboard.helpers({
  counter: function () {
    return Session.get('counter');
  },
  date: function() {
    var date = {};
    var now = Session.get("now");
    date.day = moment(now).format("dddd, MMMM Do YYYY")
    date.time = moment(now).format("h:mm:ss A")
    return date;
  },
  location: function() {
    var ll = Geolocation.latLng(); // this is reactive and fires quite a few times on startup as the location is refined
    if (ll && setLatLng(ll.lat, ll.lng)) {
      getWeather();
      console.log(findNearestSavedLocation(ll.lat, ll.lng));
    };
    if (Session.get("lat")) {
      return Session.get("lat") + "," + Session.get("lng");
    } else {
      return "locating...";
    }
  },
  weather: function() {
    var weatherData = Session.get("weatherData");
    var weather = {loadingMsg: "...Getting Weather..."};
    if (weatherData) {
      weatherData = JSON.parse(weatherData);
      weather.temp = Math.round(weatherData.currently.temperature);
      weather.conditions = weatherData.currently.summary;
      weather.loadingMsg = false;
    }
    return weather;
  }
});

Template.dashboard.events({
  'click button.logout': function(e) {
    Meteor.logout();
  }
});
