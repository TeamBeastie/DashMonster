var markers = null;
var location = null;

Template.location.onRendered(function() {
  location = this.data;
  markers = [];
  GoogleMaps.load();
  GoogleMaps.ready('map', function(map) {
    // set the initial center
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    })
    markers.push(marker);
    console.log(markers);
    google.maps.event.addListener(
      map.instance, 'center_changed', function() {
        var marker = markers[0];
        var lat = map.instance.center.lat();
        var lng = map.instance.center.lng();
        var position = new google.maps.LatLng(lat, lng);
        marker.setPosition(position);
        console.log(lat, lng);
        location.lat = lat;
        location.lng = lng;
      }
    )
  })
})

Template.location.onDestroyed(function() {
  console.log("REMOVED");
  console.log(this.data);
})

Template.location.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(this.lat, this.lng),
        zoom: 15
      }
    }
  }
})

Template.location.events({
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
  }
})
