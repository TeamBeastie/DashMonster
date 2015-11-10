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
  'submit .new-reminder-form': function(event){
    event.preventDefault();
    var $inputField = $(event.target).find(".reminderField");
    var remVar = $inputField.val();
    console.log(remVar);
    Reminders.insert({
      reminderTitle: remVar,
      createdAt: new Date(),
      userId: Meteor.userId()
    });

    $inputField.val("");

    return false;
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
