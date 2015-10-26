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
    lat: 45.512495,
    lng: -122.634825,
    userId: joe
  });
  var joeHomeStop1 = Stops.insert({
    locationId: joeHome,
    stopId: 2616,
    line: 14
  });
  var joeWork = Locations.insert({
    name: "Work",
    address: "1221 SW 1st Ave Portland, OR 97204",
    lat: 45.514428,
    lng: -122.675421,
    userId: joe
  });
  var joeWorkStop1 = Stops.insert({
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
    locationId: joeSchool,
    stopId: 11011,
    line: 195 /* B Loop */
  });
  var joeSchoolStop2 = Stops.insert({
    locationId: joeSchool,
    stopId: 7618,
    line: 290 /* MAX Orange Line */
  });
  var bob = Accounts.createUser({
    username: 'bob',
    password: 'password',
    email: 'bob@schmoe.com',
    profile: {
      name: 'Bob Schmoe'
    }
  });
  var bobHome = Locations.insert({
    name: "Home",
    address: "99 NE 28th Ave Portland, OR 97232",
    lat: 45.52284,
    lng: -122.6394937,
    userId: bob
  });
  var bobWork = Locations.insert({
    name: "Trader Joe's",
    address: "4715 Se Cesar Chavez Blvd, Portland, OR 97202",
    lat: 45.4885097,
    lng: -122.6235924,
    userId: bob
  });
};

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
