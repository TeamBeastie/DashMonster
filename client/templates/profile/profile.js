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
  },
  'click button.add-location': function(e) {
    console.log(e);
    var newLocation = {
      userId: Meteor.userId(),
      name: "Untitled Location",
      lat: 45.52,
      lng: -122.681944
    };
    var locId = Locations.insert(newLocation);
    Router.go("/location/" + locId);
  }
})

Template.profile.onRendered(function() {
  Session.set('newAccount', null);
  delete Session.keys.newAccount;
})
