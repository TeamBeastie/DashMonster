Meteor.publish('stops', function(user) {
  return Stops.find({userId: user});
});
Meteor.publish('locations', function(user) {
  return Locations.find({userId: user});
});
Meteor.publish('reminders', function(user) {
  return Reminders.find({userId: user});
});

// Publications for bus stop editing
Meteor.publish('routes', function() {
  console.log("subscribed to 'routes'");
  // just return a cursor containing the basics of each bus route: routeId and description
  return BusRoutes.find({}, {fields: {desc: 1, route: 1, type: 1}, sort:{route:1}});
});
Meteor.publish('directions', function(lineId) {
  console.log("subscribed to 'directions' for lineId: ", lineId);
  // return the dir ID and dir name of a given lineId
  return BusRoutes.find({route: lineId}, {fields: {route:1, "dir.dir": 1, "dir.desc": 1}, sort:{"dir.dir": 1}});
});
Meteor.publish('lineStops', function(lineId, direction) {
  // Returns the dir array, but only the element whose `dir` prop matches the passed in direction arg
  console.log("subscribed to lineStops for ", lineId, direction);
  console.log("lineId is a ", typeof lineId);
  return BusRoutes.find({route: lineId}, {fields: {route:1, dir:{$elemMatch:{dir:direction}}}});
});
