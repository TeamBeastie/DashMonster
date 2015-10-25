Meteor.publish('stops', function() {
  return Stops.find();
});
