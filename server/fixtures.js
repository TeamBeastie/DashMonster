if (Meteor.users.find().count() === 0) {
  console.log("make a user");
  var joe = Accounts.createUser({
    username: 'joe',
    password: 'password',
    email: 'joe@schmoe.com',
    profile: {
      name: 'Joe Schmoe'
    }
  });
  var joeHome = Locations.insert({
    name: "Home",
    address: "1400 SE 30th Ave Portland, OR 97214",
    // lat: 44.512495,
    lat: 45.512495,
    lng: -122.634825,
    userId: joe
  });
  var joeHomeStop1 = Stops.insert({
    userId: joe,
    locationId: joeHome,
    stopId: 2616,
    line: 14
  });
  var joeHomeStop2 = Stops.insert({
    userId: joe,
    locationId: joeHome,
    stopId: 417,
    line: 15
  });
  var joeWork = Locations.insert({
    name: "Work",
    address: "1221 SW 1st Ave Portland, OR 97204",
    // lat: 44.514428,
    lat: 45.514428,
    lng: -122.675421,
    userId: joe
  });
  var joeWorkStop1 = Stops.insert({
    userId: joe,
    locationId: joeWork,
    stopId: 3635,
    line: 14
  });
  var joeSchool = Locations.insert({
    name: "School",
    address: "1825 SW Broadway, Portland, OR 97201",
    lat: 45.5112894,
    lng: -122.6857454,
    userId: joe
  });
  var joeSchoolStop1 = Stops.insert({
    userId: joe,
    locationId: joeSchool,
    stopId: 11011,
    line: 195 /* B Loop */
  });
  var joeSchoolStop2 = Stops.insert({
    userId: joe,
    locationId: joeSchool,
    stopId: 7618,
    line: 290 /* MAX Orange Line */
  });
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
    address: "1400 SE 30th Ave, Portland, OR 97214",
    lat: 45.512495,
    lng: -122.634825,
    userId: erik
  });
  var erikSchool = Locations.insert({
    name: "xPCS",
    address: "735 SW 20th Pl, Portland OR 97205",
    lat: 45.5224806,
    lng: -122.6935936,
    // lat: 45.5225829,
    // lng: -122.694479,
    userId: erik
  });
  var erikHomeStop = Stops.insert({
    userId: erik,
    locationId: erikHome,
    stopId: 2616,
    line: 14
  });
  var erikSchoolStop = Stops.insert({
    userId: erik,
    locationId: erikSchool,
    stopId: 13169, // 6th and Main
    line: 14
  });
};
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
