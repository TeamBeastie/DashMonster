if (Meteor.users.find().count() === 0) {
  console.log("make a user");
  var joeId = Accounts.createUser({
    username: 'joe',
    password: 'password',
    email: 'joe@schmoe.com',
    profile: {
      name: 'Joe Schmoe'
    }
  });
  var bobId = Accounts.createUser({
    username: 'bob',
    password: 'password',
    email: 'bob@schmoe.com',
    profile: {
      name: 'Bob Schmoe'
    }
  });
  console.log(joeId);
  console.log(bobId);
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

