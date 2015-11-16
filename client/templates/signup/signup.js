var ERRORS_KEY = 'signupErrors';

Template.signup.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signup.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
})

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

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length > 0) {
      return;
    }

    Accounts.createUser({
      password: password,
      email: email
    }, function (error) {
      if (error) {
        console.log(error);
        return Session.set(ERRORS_KEY, {'none': error.reason})
      }
      Session.set('newAccount', true);
    });
  }
})
