Template.stop.helpers({
  arrivals: function(stopId, route) {
    var k = String(stopId) + "-" + String(route)
    var trimetData = Session.get('trimet');
    if (trimetData[k]) {
      trimetData = JSON.parse(trimetData[k]);
      var etas = [];
      var now = new Date();
      var arrivals = trimetData.resultSet.arrival;
      _.forEach(arrivals, function(e, i) {
        if (!e.estimated) { // use scheduled arrival if no estimate is available
          e.estimated = e.scheduled;
        }
        var eta = Math.floor((e.estimated - now) / 60000);
        if (eta === 0) eta = "Now"
        etas.push(eta);
      });
      // if the array is [0, 2], it becomes [0, and 2 minutes]
      // if the array is [0, 2, 4], it becomes [0, 2, and 2 minutes]
      etas = _.map(etas, function(e, i, a) {
        return e;
      })
      return etas.join(", ") + " Minutes"
    };
  }
})
