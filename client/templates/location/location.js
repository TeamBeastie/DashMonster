var markers = null;
var location = null; // this.data
var stops = null;

Template.location.onRendered(function() {
  location = this.data.location;
  stops = this.data.stops;
  console.log(location);
  console.log(stops);
  markers = [];
  GoogleMaps.load();
  GoogleMaps.ready('map', function(map) {
    // set the initial center
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    })
    markers.push(marker);
    google.maps.event.addListener(
      map.instance, 'center_changed', function() {
        var marker = markers[0];
        var lat = map.instance.center.lat();
        var lng = map.instance.center.lng();
        var position = new google.maps.LatLng(lat, lng);
        marker.setPosition(position);
        location.lat = lat;
        location.lng = lng;
      }
    )
  })
})

Template.location.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(this.location.lat, this.location.lng),
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true
      }
    }
  }
})

Template.location.events({
  'click .use-current': function(e) {
    var map = GoogleMaps.maps.map.instance;
    var lat = Session.get('lat');
    var lng = Session.get('lng');
    map.panTo({lat: Number(lat), lng:Number(lng)});
  },
  'click .cancel': function(e) {
    Router.go("profile");
  },
  'click .save': function(e) {
    // clear the session lat/lng so that we redetermine the location
    // when the Dashboard loads up again
    Session.set('lat', null);
    Session.set('lng', null);
    // save the new lat and lng, then go back to the profile
    Locations.update(location._id, {$set: {lat: location.lat, lng: location.lng}});
    Router.go("profile");
  },
  'submit .name-change': function(e, t) {
    e.preventDefault();
    var $nameField = $(e.target).find('.name-input')
    var newName = $nameField.val();
    $nameField.blur();
    Locations.update(location._id, {$set: {name: newName}});
  },
})
