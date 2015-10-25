Router.configure({
  layoutTemplate: 'layout'
  // waitOn: function() {
  //   return [Meteor.subscribe('stops')];
  // }
});

Router.route('/', {
  name: 'dashboard',
  waitOn: function() {
    return [Meteor.subscribe('stops')];
  },
  data: function() {
    return {stops: Stops.find()};
  }
});
