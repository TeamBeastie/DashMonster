Template.dashboardStop.helpers({
  arrivals: function(stopId, route) {
    var k = String(stopId) + "-" + String(route)
    // fetch the array of ETAs stored on Session.etas[k] and
    // build a string from that array
    var etas = Session.get('etas');
    if (etas && etas[k]) {
      var theseETAs = etas[k].map(function(e) {
        // `e` is the ETA in ms
        // use seconds:
        // var seconds = e / 1000
        // return Math.max(Math.floor(seconds), 0);
        // use minutes:
        var minutes = e / 1000 / 60
        minutes = Math.max(Math.floor(minutes), 0)
        minutes = (minutes === 0 ? "Now" : minutes);
        return minutes;
        // return Math.max(minutes, 0);
      });
      return theseETAs.join(", ") + " Minutes"
    } else {
      return "Getting arrivals..."
    }
  },
  lineName: function(stopId, route) {
    var k = String(stopId) + "-" + String(route);
    var trimetData = Session.get('trimet')[k];
    if (trimetData) {
      var arrivals = JSON.parse(trimetData).resultSet.arrival;
      var firstMatch = null;
      for (var i = 0; i < arrivals.length; i++) {
        var e = arrivals[i];
        if (e.route === route) {
          firstMatch = e;
          break;
        };
      }
      var lineName = firstMatch.shortSign;
      var regexNumber = /^\d/;
      var regexLine = /Line/;
      var regexStreetcar = /Streetcar/;
      if (regexNumber.test(lineName)) {
        return lineName.split(" ").shift()
      }
      if (regexStreetcar.test(lineName)) {
        var words = lineName.split(" ");
        return words[2] + " " + words[3];
      }
      if (regexLine.test(lineName)) {
        var words = lineName.split(" ");
        return words[0] + " " + words[1];
      };
      return lineName;
    };
  },
  hasMultipleEntries: function(route) {
    var matches = _.keys(Session.get('trimet')).filter(function(e) {
      return e.split("-").pop() === String(route);
    });
    return true;
    return matches.length > 1;
  },
  direction: function(stopId, route) {
    var k = String(stopId) + "-" + String(route);
    var trimetData = Session.get('trimet')[k];
    if (trimetData) {
      var arrivals = JSON.parse(trimetData).resultSet.arrival;
      var firstMatch = null;
      for (var i = 0; i < arrivals.length; i++) {
        var e = arrivals[i];
        if (e.route === route) {
          firstMatch = e;
          break;
        };
      }
      var lineName = firstMatch.shortSign;
      return lineName;
      // var regexTo = / to /i;
      // var index = lineName.search(regexTo);
      // lineName = lineName.substring(index++);
      // return lineName;
    }
  }
})
