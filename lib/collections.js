Locations = new Mongo.Collection('locations');
Stops =     new Mongo.Collection('stops');
Reminders = new Mongo.Collection('reminders');
// BusRoutes is the data for all routes with their directions and stops
BusRoutes = new Mongo.Collection('busRoutes');

Locations.allow({
  insert: function(userId, doc) {
    return ownsDocument(userId, doc)
  },
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc);
  },
  remove: function(userId, doc) {
    return ownsDocument(userId, doc);
  }
})

Stops.allow({
  insert: function(userId, doc) {
    return ownsDocument(userId, doc)
  },
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc);
  },
  remove: function(userId, doc) {
    return ownsDocument(userId, doc);
  }
})


Reminders.allow({
  insert: function(userId, doc) {
    return ownsDocument(userId, doc);
  },
  remove: function(userId, doc) {
  	return ownsDocument(userId, doc);
  }
})

ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
