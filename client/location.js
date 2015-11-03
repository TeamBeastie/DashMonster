var markers = [];

Template.location.onCreated(function() {
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
        // remove current marker
        markers[0].setMap(null);
        markers = [];
        // add new marker at current center
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(map.instance.center.lat(), map.instance.center.lng()),
          map: map.instance
        })
        markers.push(marker);
        // console.log(map.instance.center.lat() + "," + map.instance.center.lng());
      }
    )
    console.log(map);
    console.log(map.instance);
  })
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
