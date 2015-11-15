var markers = null;
var location = null; // this.data

Template.location.onRendered(function() {
  this.autorun(function () {
    var ll = Geolocation.latLng();
    if (ll) {
      setLatLng(ll.lat, ll.lng);
    };
  });
  location = this.data;
  markers = [];
  GoogleMaps.load();
  GoogleMaps.ready('map', function(map) {
    // set the initial center
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
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
    );
    // this line is a hack because jumping back and forth between
    // the settings page and a location page doesn't always refresh
    // the Google Map how we want. For some reason the center is not
    // set properly upon map creation so we force the center to be set
    map.instance.panTo({lat: location.lat, lng:location.lng});
  })
})

Template.location.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false
      }
    }
  },
  stops: function() {
    return Stops.find({locationId: this._id});
  }
})

Template.location.events({
  'click .use-current': function(e) {
    var map = GoogleMaps.maps.map.instance;
    var lat = Session.get('lat');
    var lng = Session.get('lng');
    if (lat && lng) {
      map.panTo({lat: Number(lat), lng:Number(lng)});
    };
  },
  'click .cancel': function(e) {
    Router.go("profile");
  },
  'click .save': function(e) {
    var $nameField = $('.name-input');
    var newName = $nameField.val();
    // clear the session lat/lng so that we redetermine the location
    // when the Dashboard loads up again
    Session.set('lat', null);
    Session.set('lng', null);
    // save the new lat and lng, then go back to the profile
    Locations.update(
      location._id,
      {$set:{lat: location.lat, lng: location.lng, name: newName}},
      function() {Router.go("profile")}
    );
  },
  'click .delete-location': function(e) {
    if (window.confirm('Delete "' + this.name + '"?')) {
      Locations.remove(this._id, function() {
        // clear the session lat/lng so that we redetermine the location
        // when the Dashboard loads up again
        Session.set('lat', null);
        Session.set('lng', null);
        Router.go("/profile")
      });
    };
  },
  'submit .name-change': function(e, t) {
    e.preventDefault();
    var $nameField = $(e.target).find('.name-input')
    var newName = $nameField.val();
    $nameField.blur();
    Locations.update(location._id, {$set: {name: newName}});
  },
  'click .add-stop': function(e, t) {
    var newStop = {
      locationId: this._id,
      userId: Meteor.userId(),
      isNew: true
    };
    Stops.insert(newStop, function(err, id) {
      Router.go("stopEditor", {_id: id});
    });
  }
})
