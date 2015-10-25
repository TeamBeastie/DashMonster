var intervalTime;
var intervalFetchArrivals;
var intervalUpdateETAs; // recompute ETAs based on new Date() vs. last fetched ETAs
var intervalWeather;

Template.dashboard.onCreated(function() {
  // console.log("Dashboard Template created");
  var tmpl = this;
  Session.set("now", new Date());
  intervalTime = Meteor.setInterval(function() {
    Session.set("now", new Date());
  }, 1000);
  intervalWeather = Meteor.setInterval(function() {
    getWeather();
  }, 1000 * 60 * 15);
  getAllArrivals(tmpl);
  intervalFetchArrivals = Meteor.setInterval(function() {
    getAllArrivals(tmpl);
  }, 1000 * 60);
})

Template.dashboard.onRendered(function() {
  // console.log(this);
  // console.log("Dashboard Template rendered");
})

Template.dashboard.onDestroyed(function() {
  Meteor.clearInterval(intervalTime);
  Meteor.clearInterval(intervalFetchArrivals);
  Meteor.clearInterval(intervalWeather);
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

var getAllArrivals = function(template) {
  // for each stop we care about, make a call to Meteor method `getArrivals()`
  // when all data has come back, set the session vars
  // console.log("getArrivals called with");
  // console.log(arg);
  console.log("template.data.stops.fetch()");
  console.log(template.data.stops.fetch());
  var stops = template.data.stops.fetch();
  Session.setDefault('trimet', {});
  stops.forEach(function(e) {
    Meteor.call('getArrivals', e.stopId, e.line, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        var k = String(e.stopId) + "-" + String(e.line);
        var trimetData = Session.get('trimet');
        trimetData[k] = result;
        console.log("trimetData is now:");
        console.log(trimetData);
        Session.set('trimet', trimetData);
      };
    });
  })
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
    // maybe just return data stored in Session vars? And setting that data will happen elsewhere?
    var weatherData = Session.get("weatherData");
    // console.log(weatherData);
    return weatherData;
  }
});

Template.dashboard.events({
  'click button.refresh': function () {
    console.log("clicked the REFRESH button");
    // Session.set('counter', Session.get('counter') + 1);
  }
});
