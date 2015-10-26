var intervalTime;
var intervalFetchArrivals;
var intervalUpdateETAs; // recompute ETAs based on new Date() vs. last fetched ETAs
var intervalWeather;

// how frequently to fetch and/or update our data?
var timeoutFetchArrivals = 30 * 1000;
var timeoutFetchWeather = 15 * 60 * 1000;
var timeoutUpdateETAs = 1 * 1000;

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
  }, timeoutFetchWeather);
  getAllArrivals(tmpl);
  intervalFetchArrivals = Meteor.setInterval(function() {
    getAllArrivals(tmpl);
  }, timeoutFetchArrivals);
  intervalUpdateETAs = Meteor.setInterval(function() {
    updateETAs();
  }, timeoutUpdateETAs)
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

var getWeather = function() {
  console.log("called getWeather at ", new Date());
  var lat = Session.get('lat');
  var lng = Session.get('lng');
  Meteor.call('getWeather', lat, lng, function (error, result) {
    if (error) {
      console.log("error", error);
    }
    if (result) {
      Session.set("weatherData", result);
    };
  });
}

// makes a call to the TriMet API for each stop we are concerned about
// stores the results of the API calls on a Session.trimet object
// called at an interval of 60s
var getAllArrivals = function(template) {
  // for each stop we care about, make a call to Meteor method `getArrivals()`
  // when all data has come back, set the session vars
  // console.log("getArrivals called with");
  // console.log(arg);
  var stops = template.data.stops.fetch();
  stops.forEach(function(e) {
    Meteor.call('getArrivals', e.stopId, e.line, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        var k = String(e.stopId) + "-" + String(e.line);
        var trimetData = Session.get('trimet');
        trimetData[k] = result;
        Session.set('trimet', trimetData);
        // we could immediately updateETAs here, since we just got
        // new data, but this is overkill since ETAs are updated
        // every second already.
        // updateETAs(template);
      };
    });
  })
}

// called every second or so. loops over the Session.trimet object
// and updates the related Session.etas object with the current ETA
// for each arrival object on the Session.trimet object
var updateETAs = function(template) {
  var now = new Date();
  // loop over the Session.trimet object. Each key contains raw trimet JSON data. loop over the `arrival` array on each trimet data obj. Compute the ETA in seconds and store it as an array on Session.etas[k]
  var trimetData = Session.get('trimet');
  var etas = Session.get('etas');
  for (var k in trimetData) {
    var data = JSON.parse(trimetData[k]);
    var route = k.split("-").pop();
    var arrivals = data.resultSet.arrival;
    arrivals = arrivals.filter(function(e) {
      return e.route === parseInt(route);
    });
    var theseEtas = arrivals.map(function(e) {
      if (!e.estimated) {
        e.estimated = e.scheduled;
      }
      return (e.estimated - now);
    })
    etas[k] = theseEtas;
    Session.set('etas', etas);
  }
}

Template.dashboard.helpers({
  counter: function () {
    return Session.get('counter');
  },
  time: function() {
    var now = Session.get("now");
    return now;
  },
  location: function() {
    // console.log("called the location() helper");
    var ll = Geolocation.latLng(); // this is reactive and fires quite a few times on startup as the location is refined
    if (ll && setLatLng(ll.lat, ll.lng)) {
      getWeather();
    };
    if (Session.get("lat")) {
      return Session.get("lat") + "," + Session.get("lng");
    };
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
  'click button.refresh': function () {
    console.log("clicked the REFRESH button");
  }
});
