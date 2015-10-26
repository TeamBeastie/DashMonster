Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
  // waitOn: function() {
  //   return [Meteor.subscribe('stops')];
  // }
});

Router.route('/', {
  name: 'dashboard',
  waitOn: function() {
    return [
      Meteor.subscribe('stops', Meteor.userId()),
      Meteor.subscribe('locations', Meteor.userId()),
      Meteor.subscribe('reminders', Meteor.userId())
    ];
  },
  data: function() {
    return {stops: Stops.find()};
  }
});

Router.route("login", {
  path: '/login'
})

Router.route("/profile", {
  name: 'profile'
})


/*
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  // waitOn: function() {
  //   return [Meteor.subscribe('notifications')];
  // }
});
*/
// if logged in and you go to `login` redirect to `dashboard`


// redirect to `login` page if you go anywhere but the `login` or `signup` routes
Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    console.log("not logged in");
    // this.setLayout('login');
    this.redirect('login')
    // this.render('login');
    // return pause();
  } else {
    this.next();
    // this.setLayout(this.lookupLayoutTemplate());
  }
}, {except: ['login', 'signup']});

// redirect to `dashboard` page if you try to view `login` or `signup` pages while logged in
Router.onBeforeAction(function() {
  if (Meteor.userId()) {
    console.log("logged in");
    // this.setLayout('login');
    this.redirect("/")
    // this.render('dashboard');
    // return pause();
  } else {
    this.next();
    // this.setLayout(this.lookupLayoutTemplate());
  }
}, {only: ['login', 'signup']});
