var intervalTime;
var intervalArrivals;
var intervalWeather;

// Session.setDefault("lat", "0");
// Session.setDefault("lng", "0");
Session.setDefault("stops", [
  {route: 14, stopLocation: "SE Hawthorne and SE 30th Ave", stopId: 2616},
  {route: 15, stopLocation: "SE Belmont and SE 30th Ave", stopId: 417}
]);

// var getLocation = function() {
//   console.log("called getLocation()");
//   var l = Geolocation.currentLocation();
//   var ll = Geolocation.latLng();
//   return ll.lat + "," + ll.lng;
// }

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

var getAllArrivals = function() {
  // for each stop we care about, make a call to Meteor method `getArrivals()`
  // when all data has come back, set the session vars
  // console.log("getArrivals called with");
  // console.log(arg);
  var stops = Session.get('stops');
  stops.forEach(function(e) {
    Meteor.call('getArrivals', e.stopId, e.route, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("got data back from Meteor.getArrivals():");
        console.log(result);
        // console.log("got result", result);
        var k = String(e.stopId) + "-" + String(e.route);
        console.log(k);
        console.log(typeof k);
        Session.set(k, result);
        console.log("Now get the value of Session ", k);
        console.log(Session.get(k));
      };
    });
  })
  /*
  Meteor.call('getArrivals', 2616, 14, function (error, result) {
    if (error) {
      console.log("error", error);
    }
    if (result) {
      console.log("got result", result);
    };
  });
  */
  // console.log(Template.dashboard);
}

Template.dashboard.onCreated(function() {
  // console.log("Dashboard Template created");
  Session.set("now", new Date());
  intervalTime = Meteor.setInterval(function() {
    Session.set("now", new Date());
  }, 1000);
  intervalWeather = Meteor.setInterval(function() {
    getWeather();
  }, 1000 * 60 * 15);
  getAllArrivals();
  // intervalArrivals = Meteor.setInterval(function() {
    // getAllArrivals();
  // }, 1000 * 60);
  // TODO call a function every 60s that makes TriMet API calls for each stop that we care about
})

Template.dashboard.onRendered(function() {
  // console.log(this);
  // console.log("Dashboard Template rendered");
})

Template.dashboard.onDestroyed(function() {
  Meteor.clearInterval(intervalTime);
  Meteor.clearInterval(intervalLocation);
  Meteor.clearInterval(intervalWeather);
})

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
  },
  stops: Session.get('stops')
  // stops:
  // [
  //   {route: 14, stopLocation: "SE Hawthorne and SE 30th Ave", stopId: 2616},
  //   {route: 15, stopLocation: "SE Belmont and SE 30th Ave", stopId: 417}
  //   // {route: "14", stopLocation: "SE Hawthorne and SE 30th Ave", arrivals: "0, 6 and 24 minutes"},
  //   // {route: "15", stopLocation: "SE Belmont and SE 30th Ave", arrivals: "6, 12 and 39 minutes"}
  // ]
});

Template.dashboard.events({
  'click button.refresh': function () {
    console.log("clicked the REFRESH button");
    // Session.set('counter', Session.get('counter') + 1);
  }
});

Template.stop.helpers({
  arrivals: function(stopId, route) {
    console.log("arrivals helper called");
    var k = String(stopId) + "-" + String(route)
    var trimetData = Session.get(k);
    console.log("trimetData is:");
    console.log(trimetData);
    if (trimetData) {
      console.log("raw value of Session " + k);
      console.log(trimetData);
      trimetData = JSON.parse(trimetData);
      return trimetData.resultSet.arrival[0].estimated
      // return "data...";
    };

    // loop over the trimetData and build a string of arrival times
    // var arrivals = "0, 1, and 2 minutes"
    // return trimetData.resultSet.arrivals[0].estimated;
    // return arrivals
  }
})
