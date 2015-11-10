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

Router.route("/signup", {
  name: 'signup'
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
    return [
      Meteor.subscribe('locations', Meteor.userId()),
      Meteor.subscribe('stops', Meteor.userId())
    ]
  },
  data: function() {
    return Locations.findOne(this.params._id);
  }
})

redirectToLogin = function() {
  if (!Meteor.userId()) {
    this.redirect('login');
  } else {
    this.next();
  }
}

redirectToDashboard = function() {
  if (Meteor.userId()) {
    if (Session.get('newAccount')) {
      this.redirect("profile");
    } else {
      this.redirect("dashboard");
    }
  } else {
    this.next();
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
