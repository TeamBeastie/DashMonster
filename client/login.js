Template.login.events({
  'submit form': function(event, template) {
    event.preventDefault();
    console.log("submit...");
    var email = template.$('[name=email]').val();
    // var password = template.$('[name=password]').val();
    var password = $('[name=password]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }

    // Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length > 0) {
      return;
    }

    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        // return Session.set(ERRORS_KEY, {'none': error.reason});
        console.log(error);
        return;
      }

      Router.go('dashboard');
    });
  }
})
