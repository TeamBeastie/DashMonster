Template.stop.helpers({
  arrivals: function(stopId, route) {
    var k = String(stopId) + "-" + String(route)
    // fetch the array of ETAs stored on Session.etas[k] and
    // build a string from that array
    var etas = Session.get('etas');
    if (etas && etas[k]) {
      var theseETAs = etas[k].map(function(e) {
        // `e` is the ETA in ms
        var minutes = e / 1000 / 60
        return Math.max(Math.floor(minutes), 0);
      })
      return theseETAs.join(", ") + " Minutes"
    };
  }
})
