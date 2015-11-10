

Template.reminder.helpers({

	remindersList: function(){
		return Reminders.find();
	},

	remindersCount: function (){
    return Reminders.find().count();
  	}
});

Template.remindersTemplate.events({
	'click button.remove-reminder': function(){
		result = window.confirm('Delete "' + this.reminderTitle + '"?');

		if (result){
		Reminders.remove(this._id);
		}
	}
})


