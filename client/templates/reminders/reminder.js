

Template.reminder.helpers({

	remindersList: function(){
		return Reminders.find();
	},

	remindersCount: function (){
    return Reminders.find().count();
	},

	remindersLabel: function() {
		var label = "REMINDERS"
		if (Reminders.find().count() === 1) {
			label = "REMINDER"
		};
		return label;
	}
});

Template.remindersTemplate.events({
	'click button.remove-reminder': function(){
		var result = window.confirm('Delete "' + this.reminderTitle + '"?');

		if (result){
		Reminders.remove(this._id);
		}
	}
})


