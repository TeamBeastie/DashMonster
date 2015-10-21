setLatLng = function(lat, lng) {
  console.log("called setLatLng with: ", lat, lng);
  var changed = false;
  var oldLat = Session.get('lat')
  var oldLng = Session.get('lng')
  var newLat = lat.toFixed(3);
  var newLng = lng.toFixed(3);
  if (newLat !== oldLat) {
    Session.set('lat', newLat);
    changed = true;
  }
  if (newLng !== oldLng) {
    Session.set('lng', newLng);
    changed = true;
  }
  return changed;
}
