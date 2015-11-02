Template.signup.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var displayname = template.$('[name=displayname]').val();
    // var password = template.$('[name=password]').val();
    var password = $('[name=password]').val();
    var confirm = $('[name=confirm]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! displayname) {
      errors.displayname = 'Name is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }

    if (password !== confirm) {
      errors.password = 'Password is required';
    }

    // Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length > 0) {
      console.log(_.keys(errors));
      return;
    }

    Accounts.createUser({
      password: password,
      email: email,
      profile: {
        name: displayname
      }
    }, function (error) {
      if (error) {
        console.log("error!");
        console.log(error);
        return;
      }
      console.log("go to the Profile page");
      console.log(Meteor.user());
      Session.set('newAccount', true);
      // Router.go('profile')
    });
  }
})
