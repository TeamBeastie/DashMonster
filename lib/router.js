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
  }
});

Router.route("/login", {
  name: 'login'
})

Router.route("/logout", {
  name: 'logout'
})

Router.route("/profile", {
  name: 'profile',
  waitOn: function() {
    return [
      Meteor.subscribe('locations', Meteor.userId()),
      Meteor.subscribe('reminders', Meteor.userId())
    ];
  },
  data: function() {
    return {
      locations: Locations.find(),
      reminders: Reminders.find()
    }
  }
})

Router.route("/location/:_id", {
  name: 'location',
  waitOn: function() {
    return [Meteor.subscribe('locations', Meteor.userId())]
  },
  data: function() {
    var location = Locations.findOne({_id: this.params._id});
    return location;
  }
})

redirectToLogin = function() {
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
}

redirectToDashboard = function() {
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
}

// redirect to `login` page if you go anywhere but the `login` or `signup` routes
Router.onBeforeAction(
  redirectToLogin,
  {except: ['login', 'signup']}
);

// redirect to `dashboard` page if you try to view `login` or `signup` pages while logged in
Router.onBeforeAction(
  redirectToDashboard,
  {only: ['login', 'signup']}
);
Router.onBeforeAction('dataNotFound');
