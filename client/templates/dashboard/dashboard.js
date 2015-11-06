var intervalTime;
var intervalFetchArrivals;
var intervalUpdateETAs; // recompute ETAs based on new Date() vs. last fetched ETAs
var intervalWeather;

// how frequently to fetch and/or update our data?
const TIMEOUT_FETCH_ARRIVALS = 30 * 1000;
const TIMEOUT_FETCH_WEATHER = 15 * 60 * 1000;
const TIMEOUT_UPDATE_ETAS = 1 * 1000;

Template.dashboard.onCreated(function() {
  // var tmpl = this;
  // Session.set("now", new Date());
  // Session.setDefault('etas', {});
  // Session.setDefault('trimet', {});
  // // getAllArrivals(tmpl);
  // intervalTime = Meteor.setInterval(function() {
  //   Session.set("now", new Date());
  // }, 1000);
  // intervalWeather = Meteor.setInterval(function() {
  //   getWeather();
  // }, TIMEOUT_FETCH_WEATHER);
  // intervalFetchArrivals = Meteor.setInterval(function() {
  //   getAllArrivals(tmpl);
  // }, TIMEOUT_FETCH_ARRIVALS);
  // intervalUpdateETAs = Meteor.setInterval(function() {
  //   updateETAs();
  // }, TIMEOUT_UPDATE_ETAS)
})

Template.dashboard.onRendered(function() {
  var tmpl = this;
  Session.set("now", new Date());
  Session.setDefault('etas', {});
  Session.setDefault('trimet', {});
  // getAllArrivals(tmpl);
  intervalTime = Meteor.setInterval(function() {
    Session.set("now", new Date());
  }, 1000);
  intervalWeather = Meteor.setInterval(function() {
    getWeather();
  }, TIMEOUT_FETCH_WEATHER);
  intervalFetchArrivals = Meteor.setInterval(function() {
    getAllArrivals(tmpl);
  }, TIMEOUT_FETCH_ARRIVALS);
  intervalUpdateETAs = Meteor.setInterval(function() {
    updateETAs();
  }, TIMEOUT_UPDATE_ETAS)
})

Template.dashboard.onDestroyed(function() {
  Meteor.clearInterval(intervalTime);
  Meteor.clearInterval(intervalFetchArrivals);
  Meteor.clearInterval(intervalWeather);
  Meteor.clearInterval(intervalUpdateETAs);
})

Template.dashboard.helpers({
  user: function () {
    return Meteor.user().profile.name;
  },
  date: function() {
    var date = {};
    var now = Session.get("now");
    date.day = moment(now).format("dddd, MMMM Do YYYY")
    date.time = moment(now).format("h:mm:ss")
    date.meridian = moment(now).format("A")
    return date;
  },
  location: function() {
    var ll = Geolocation.latLng(); // this is reactive and fires quite a few times on startup as the location is refined
    if (ll && setLatLng(ll.lat, ll.lng)) {
      getWeather();
      var loc = findNearestSavedLocation(ll.lat, ll.lng);
      Session.set('location', loc);
      Session.set('stops', Stops.find({locationId: loc._id}).fetch());
      getAllArrivals(this);
    };
    if (Session.get('location')) {
      return Session.get('location').name;
    } else {
      return "locating...";
    }
  },
  weather: function() {
    var weather = {loadingMsg: "...Getting Weather..."};
    var weatherData = Session.get("weatherData");
    if (weatherData) {
      weatherData = JSON.parse(weatherData);
      console.log(weatherData);
      weather.temp = Math.round(weatherData.currently.temperature);
      weather.conditions = weatherData.currently.summary;
      weather.loadingMsg = false;
      weather.nextHour = weatherData.minutely.summary;
      weather.next24Hours = weatherData.hourly.summary;
      weather.high = Math.round(weatherData.daily.data[0].temperatureMax);
      weather.highTime = weatherData.daily.data[0].temperatureMaxTime;
      weather.low = Math.round(weatherData.daily.data[0].temperatureMin);
      weather.lowTime = weatherData.daily.data[0].temperatureMinTime;
    }
    return weather;
  },
  testHelper: function() {
    return "test works!";
  },
  stops: function() {
    return Session.get('stops');
  }
});

Template.dashboard.events({
  'click button.logout': function(e) {
    Router.go("/logout")
  }
});
