/*if (Meteor.users.find().count() === 0) {
  var erik = Accounts.createUser({
    username: 'erik',
    password: 'password',
    email: 'eirkeirkeirk@gmail.com',
    profile: {
      name: 'Erik P. Hansen'
    }
  });
  var erikHome = Locations.insert({
    name: "Home",
    // address: "1400 SE 30th Ave, Portland, OR 97214",
    lat: 45.512495,
    lng: -122.634825,
    userId: erik
  });
  var erikSchool = Locations.insert({
    name: "xPCS",
    // address: "735 SW 20th Pl, Portland OR 97205",
    lat: 45.5224806,
    lng: -122.6935936,
    userId: erik
  });
  var erikHomeStop = Stops.insert({
    userId: erik,
    locationId: erikHome,
    customDescription: false,
    lineId: 14,
    lineDescription: "14-Hawth",
    directionId: 0,
    directionDescription: "to Downtown",
    stopId: 2616,
    stopDescription: "SE Hawthorne and 30th",
    isNew: false
  });
  var erikHomeStop2 = Stops.insert({
    userId: erik,
    locationId: erikHome,
    customDescription: false,
    lineId: 15,
    lineDescription: "15-Bel",
    directionId: 0,
    directionDescription: "to NW",
    stopId: 417,
    stopDescription: "SE Belmont and 30th",
    isNew: false
  });
  var erikSchoolStop = Stops.insert({
    userId: erik,
    locationId: erikSchool,
    customDescription: false,
    lineId: 14,
    lineDescription: "14-Hawth",
    directionId: 1,
    directionDescription: "to the SE",
    stopId: 13169,
    stopDescription: "SW Main and 6th",
    isNew: false
  });
};*/

/*
if (Stops.find().count() === 0) {
  Stops.insert({
    line: 14,
    stopId: 2616,
    location: "SE Hawthorne and SE 30th Ave"
  });

  Stops.insert({
    line: 15,
    stopId: 417,
    location: "SE Belmont and SE 30th Ave"
  });
}
*/
