Template.profile.helpers({
  username: function () {
    return Meteor.user().profile.name;
  },
});

Template.profile.events({
  'submit .name-change': function(e, t) {
    e.preventDefault();
    var $nameField = $(e.target).find('.name-input')
    var newName = $nameField.val();
    $nameField.blur();
    var profile = Meteor.user().profile;
    profile.name = newName;
    Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
  },

  'click button.logout': function(e) {
    // Meteor.logout();
    Router.go("/logout")
  }
})

Template.profile.onRendered(function() {
  Session.set('newAccount', null);
  delete Session.keys.newAccount;
})






