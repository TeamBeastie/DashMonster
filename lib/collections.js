Locations = new Mongo.Collection('locations');
Stops = new Mongo.Collection('stops');
Reminders = new Mongo.Collection('reminders');

Locations.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc);
  }
})

ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
