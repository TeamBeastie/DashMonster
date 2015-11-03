Template.logout.rendered = function() {
  Meteor.logout(function(err) {
    if (err) {
      Alerts.add('Error logging out: ' + err); // using mrt:bootstrap-alerts
    } else {
      // your cleanup code here
      Object.keys(Session.keys).forEach(function(key) {
        Session.set(key, undefined);
      });
      Session.keys = {} // remove session keys
      Router.go('/'); // redirect to the home page or elsewhere using iron:router
    }
  });
}
