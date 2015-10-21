var intervalTime;
var intervalLocation;

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
    };
    return Session.get("lat") + "," + Session.get("lng");
    // return "some dumb location data";
  },
  weather: function() {
    var weatherData = null;
    Meteor.call('getWeather', Session.get("lat"), Session.get("lng"), function (error, result) {
      console.log("result of the call to getWeather:");
      console.log(result);
      console.log("error of the call to getWeather:");
      console.log(error);
      weatherData = result;
    });
    console.log("weatherData is : " + weatherData);
    return weatherData;
  }
});

Template.dashboard.events({
  'click button.refresh': function () {
    console.log("clicked the REFRESH button");
    // Session.set('counter', Session.get('counter') + 1);
  }
});
