Template.dashboard.helpers({
  counter: function () {
    return Session.get('counter');
  },
  location: function() {
    var l = Geolocation.currentLocation();
    var ll = Geolocation.latLng();
    console.log(l);
    console.log(ll);
    return ll.lat + "," + ll.lng;
  }
});

Template.dashboard.events({
  'click button': function () {
    // Session.set('counter', Session.get('counter') + 1);
  }
});

Template.dashboard.onCreated(function() {
  console.log("Dashboard Template created");
  console.log(" > `this` is:");
  console.log(this);
})

Template.dashboard.onRendered(function() {
  console.log("Dashboard Template rendered");
  console.log(" > `this` is:");
  console.log(this);
})
