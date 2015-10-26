Meteor.publish('stops', function(user) {
  return Stops.find({userId: user});
});
Meteor.publish('locations', function(user) {
  return Locations.find({userId: user});
});
Meteor.publish('reminders', function(user) {
  return Reminders.find({userId: user});
});
