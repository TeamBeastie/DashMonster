Template.signup.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var password = $('[name=password]').val();
    var confirm = $('[name=confirm]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }

    if (password !== confirm) {
      errors.confirm = "Passwords don't match";
    }

    // Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length > 0) {
      console.log(_.keys(errors));
      console.log(errors);
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
        console.log("error creating new account!");
        console.log(error);
        return;
      }
      Session.set('newAccount', true);
    });
  }
})
