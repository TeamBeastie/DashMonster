var CURRENT_STOP = 'currentStop'

Template.stopEditor.onCreated(function() {
  var template = this;
  var currentStop = {};
  // make a copy of the Stop
  Object.keys(template.data).forEach(function(e, i) {
    currentStop[e] = template.data[e];
  })
  Session.set(CURRENT_STOP, currentStop);
});

Template.stopEditor.onDestroyed(function() {
  console.log(this.data);
  // if this a brand new stop that's never been saved, delete it
  if (this.data.isNew) {
    Stops.remove(this.data._id);
  };
})

Template.stopEditor.helpers({
  // TODO: make one function that can be used instead of these separate functions
  lineDescription: function () {
    return Session.get(CURRENT_STOP).lineDescription;
  },
  directionDescription: function () {
    return Session.get(CURRENT_STOP).directionDescription;
  },
  stopDescription: function () {
    return Session.get(CURRENT_STOP).stopDescription;
  },
  lineNumber: function () {
    return Session.get(CURRENT_STOP).lineId;
  },
  busLines: function() {
    var sub = Meteor.subscribe("routes");
    if (sub.ready()) {
      return BusRoutes.find();
    };
  },
  // returns a single object with a `dir` Array that contains direction info
  busDirections: function() {
    var routeId = Session.get(CURRENT_STOP).lineId;
    var sub = Meteor.subscribe("directions", routeId);
    if (sub.ready()) {
      return BusRoutes.findOne({route: routeId});
    };
  },
  // returns an array of objects, one for each bus stop in the given route and direction
  busStops: function() {
    var routeId = Session.get(CURRENT_STOP).lineId;
    var direction = Session.get(CURRENT_STOP).directionId;
    var sub = Meteor.subscribe("lineStops", routeId, direction);
    if (sub.ready()) {
      var data = BusRoutes.findOne({route: routeId});
      return data.dir[0].stop;
    };
  }
});

Template.stopEditor.events({
  'click button.line-description': function (event, template) {
    var stopData = Session.get(CURRENT_STOP);
    // stopData["_id"] = null; // why am I wiping out the ID?
    stopData["lineDescription"] = null;
    stopData["lineId"] = null;
    stopData["directionDescription"] = null;
    stopData["directionId"] = null;
    stopData["stopDescription"] = null;
    stopData["stopId"] = null;
    Session.set(CURRENT_STOP, stopData);
  },
  'click button.direction-description': function (event, template) {
    var stopData = Session.get(CURRENT_STOP);
    stopData["directionDescription"] = null;
    stopData["directionId"] = null;
    stopData["stopDescription"] = null;
    stopData["stopId"] = null;
    Session.set(CURRENT_STOP, stopData);
  },
  'click button.stop-description': function (event, template) {
    var stopData = Session.get(CURRENT_STOP);
    stopData["stopDescription"] = null;
    stopData["stopId"] = null;
    Session.set(CURRENT_STOP, stopData);
  },
  'click button.save': function(event, template) {
    var stopData = Session.get(CURRENT_STOP);
    var self = this;
    Stops.update(this._id, {$set: {
        lineDescription: stopData.lineDescription,
        lineId: stopData.lineId,
        directionDescription: stopData.directionDescription,
        directionId: stopData.directionId,
        stopDescription: stopData.stopDescription,
        stopId: stopData.stopId,
        isNew: false
      }},
      function() {
        Router.go('location', {_id: self.locationId});
      }
    )
  },
  'click button.cancel': function(event, template) {
    // go back to location
    Router.go('location', {_id: this.locationId})
  },
  'click button.delete': function(event, template) {
    var locationId = this.locationId;
    var result = window.confirm('Delete this transit stop?');

    if (result) {
      Stops.remove(this._id, function(error) {
        // go back to Location page
        Router.go('location', {_id: locationId})
      });
    }

  }
});

Template.singleRoute.events({
  'click button': function(e, t) {
    // save the lineDescription and lineId to the `stopData`
    var stopData = Session.get(CURRENT_STOP);
    stopData.lineDescription = this.desc;
    stopData.lineId = this.route;
    // stopData._id = this._id;
    Session.set(CURRENT_STOP, stopData);
  }
})

Template.singleDirection.events({
  'click button': function(e, t) {
    var stopData = Session.get(CURRENT_STOP);
    stopData.directionDescription = this.desc;
    stopData.directionId = this.dir;
    console.log(stopData);
    Session.set(CURRENT_STOP, stopData);
    // console.log(id);
  }
})

Template.singleStop.events({
  'click button': function(e, t) {
    var stopData = Session.get(CURRENT_STOP);
    stopData.stopDescription = this.desc;
    stopData.stopId = this.locid;
    Session.set(CURRENT_STOP, stopData);
    // console.log(id);
  }
})
