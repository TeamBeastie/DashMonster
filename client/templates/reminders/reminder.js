

Template.reminder.helpers({

	remindersList: function(){
		return Reminders.find();
	},

	remindersCount: function (){
    return Reminders.find().count();
  	}
});

Template.profile.events({
	'submit .new-reminder-form': function(event){
		event.preventDefault();
		var remVar = $(event.target).find(".reminderField").val();
		console.log(remVar);
		Reminders.insert({
			reminderTitle: remVar,
			createdAt: new Date(),
			userId: Meteor.userId() 
		});

		// event.target.titleField.value = "";

		return false;
	},

});

Template.remindersTemplate.events({
	'click button.remove-reminder': function(){
		result = window.confirm('Remove this reminder?');
		
		if (result){
		Reminders.remove(this._id);
		}
	}
})


