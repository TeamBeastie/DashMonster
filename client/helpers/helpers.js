setLatLng = function(lat, lng) {
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

findNearestSavedLocation = function(lat, lng) {
  // loop over all the Locations and find the closest one
  var locationsWithDistance = Locations.find().map(function (loc) {
    loc.distance = Math.pow(loc.lat - lat, 2) + Math.pow(loc.lng - lng, 2);
    return loc;
  });
  locationsWithDistance.sort(function(a, b) {
    return a.distance - b.distance;
  })
  return locationsWithDistance.shift();
}

getWeather = function() {
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

// makes a call to the TriMet API for each stop we are concerned about
// stores the results of the API calls on a Session.trimet object
// called at an interval of 60s
getAllArrivals = function(template) {
  // for each stop we care about, make a call to Meteor method `getArrivals()`
  // when all data has come back, set the session vars
  // console.log("getArrivals called with");
  // console.log(arg);
  var stops = Session.get('stops');
  if (!stops) {return};
  // var stops = template.data.stops.fetch();
  stops.forEach(function(e) {
    Meteor.call('getArrivals', e.stopId, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        var k = String(e.stopId) + "-" + String(e.lineId);
        var trimetData = Session.get('trimet');
        trimetData[k] = result;
        Session.set('trimet', trimetData);
        // we could immediately updateETAs here, since we just got
        // new data, but this is overkill since ETAs are updated
        // every second already.
        // updateETAs(template);
      };
    });
  })
}

// called every second or so. loops over the Session.trimet object
// and updates the related Session.etas object with the current ETA
// for each arrival object on the Session.trimet object
updateETAs = function(template) {
  var now = new Date();
  // loop over the Session.trimet object. Each key contains raw trimet JSON data. loop over the `arrival` array on each trimet data obj. Compute the ETA in seconds and store it as an array on Session.etas[k]
  var trimetData = Session.get('trimet');
  var etas = Session.get('etas');
  for (var k in trimetData) {
    var data = JSON.parse(trimetData[k]);
    var route = k.split("-").pop();
    var arrivals = data.resultSet.arrival;
    arrivals = arrivals.filter(function(e) {
      return e.route === parseInt(route);
    });
    var theseEtas = arrivals.map(function(e) {
      if (!e.estimated) {
        e.estimated = e.scheduled;
      }
      return (e.estimated - now);
    })
    etas[k] = theseEtas;
    Session.set('etas', etas);
  }
}
