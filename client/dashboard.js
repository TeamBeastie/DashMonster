var intervalTime;
var intervalLocation;

Session.setDefault("lat", "0");
Session.setDefault("lng", "0");

var getLocation = function() {
  console.log("called getLocation()");
  var l = Geolocation.currentLocation();
  var ll = Geolocation.latLng();
  return ll.lat + "," + ll.lng;
}

Template.dashboard.onCreated(function() {
  console.log("Dashboard Template created");
  intervalTime = setInterval(function() {
    Session.set("now", new Date());
  }, 1000);
})

Template.dashboard.onRendered(function() {
  console.log("Dashboard Template rendered");
})

Template.dashboard.onDestroyed(function() {
  clearInterval(intervalTime);
  clearInterval(intervalLocation);
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
    console.log("called the location() helper");
    var ll = Geolocation.latLng();
    // only set Session lat and lng if they have changed enough since the last time
    if (ll) {
      Session.set("lat", ll.lat);
      Session.set("lng", ll.lng);
      Meteor.call('getWeather', ll.lat, ll.lng, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {
          Session.set("weatherData", result);
        };
      });
    };
    return Session.get("lat") + "," + Session.get("lng");
  },
  weather: function() {
    // maybe just return data stored in Session vars? And setting that data will happen elsewhere?
    var weatherData = Session.get("weatherData");
    return weatherData.currently.temperature + " " + weatherData.currently.summary;
  }
});

Template.dashboard.events({
  'click button.refresh': function () {
    console.log("clicked the REFRESH button");
    // Session.set('counter', Session.get('counter') + 1);
  }
});
