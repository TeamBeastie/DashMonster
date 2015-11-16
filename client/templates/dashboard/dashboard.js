var intervalTime;
var intervalFetchArrivals;
var intervalUpdateETAs; // recompute ETAs based on new Date() vs. last fetched ETAs
var intervalWeather;

// how frequently to fetch and/or update our data?
const TIMEOUT_FETCH_ARRIVALS = 30 * 1000;
const TIMEOUT_FETCH_WEATHER = 15 * 60 * 1000;
const TIMEOUT_UPDATE_ETAS = 1 * 1000;

Template.dashboard.onRendered(function() {
  var tmpl = this;
  Session.set("now", new Date());
  Session.setDefault('etas', {});
  Session.setDefault('trimet', {});
  Session.set('lat', null);
  Session.set('lng', null);
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
  }, TIMEOUT_UPDATE_ETAS);
  // refresh the `stops` Session var on page load
  // it's possible that someone just edited the stops that they care about and
  // when they return to the dashboard it won't show them the new stops
  var currentLocation = Session.get('location');
  if (currentLocation) {
    Session.set('stops', Stops.find({locationId: currentLocation._id}).fetch());
    getAllArrivals(this);
  };
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
    date.time = moment(now).format("h:mm:ss A")
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
  locationObject: function() {
      return Session.get('location');
  },
  weather: function() {
    var weather = {loadingMsg: "...Getting Weather..."};
    var weatherData = Session.get("weatherData");
    if (weatherData) {
      weatherData = JSON.parse(weatherData);
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
  precipitation: function() {
    var precipitation = {loadingMsg: "...Getting Precipitation..."};
    // var weatherData = Session.get("fakeWeatherData");
    var weatherData = Session.get("weatherData");

    if (weatherData) {
      precipitation.loadingMsg = false;
      weatherData = JSON.parse(weatherData);
      var points =  weatherData.minutely.data;
      precipitation.precipArray = points.map(function(obj){
        return obj.precipIntensity;
      });
      console.log(precipitation.precipArray);
      // precipitation.next24Hours = weatherData.hourly.summary;
    }
    return precipitation;
  },
  testHelper: function() {
    return "test works!";
  },
  stops: function() {
    return Session.get('stops');
  },
  hasStops: function() {
    var stops = Session.get('stops');
    if (stops && stops.length > 0) {
      return true;
    } else {
      return false;
    };
  }
});

Template.dashboard.events({
  'click .add-stop': function(e, t) {
    var location = Session.get('location');
    var newStop = {
      locationId: location._id,
      userId: Meteor.userId(),
      isNew: true
    };
    Stops.insert(newStop, function(err, id) {
      Router.go("stopEditor", {_id: id});
    });
  }
})
