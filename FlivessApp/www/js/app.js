// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage','ngOpenFB','ngCordova','angularMoment'])

.run(function($ionicPlatform,$state,$stateParams,ngFB) {
  $ionicPlatform.ready(function() {
    ngFB.init({appId: '171606643237841'});
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })

    .state('tracking',{
      url: '/tracking/:type/:id_comun/:distance/:id',
      cache:false,
      templateUrl: 'templates/tracking.html',
      controller: 'TrackingCtrl'
    })

    .state('search',{
      url: '/search',
      cache:false,
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
    })
    .state('editprofile',{
      url: '/editprofile',
      cache:false,
      templateUrl: 'templates/editprofile.html',
      controller: 'EditProfileCtrl'
    })


   .state('selecter',{
      url: '/selecter',
      cache:false,
      templateUrl: 'templates/selecter.html',
      controller: 'SelecterCtrl'
    })
    .state('nearoutes',{
      url: '/nearoutes/:range',
      cache:false,
      templateUrl: 'templates/nearoutes.html',
      controller: 'NearRoutesCtrl'
    })


    .state('profile',{
      url: '/profile/:username',
      cache:false,
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    })


    .state('tracksUser',{
      url: '/tracks/:username',
      cache:false,
      templateUrl: 'templates/tracks-user.html',
      controller: 'TracksUserCtrl'
    })

    .state('friends',{
      url: '/friends/:type/:username',
      cache:false,
      templateUrl: 'templates/friends-list.html',
      controller: 'FriendsCtrl'
    })

    .state('followers',{
      url: '/followers/:username',
      cache:false,
      templateUrl: 'templates/followers-list.html',
      controller: 'FollowersCtrl'
    })

    .state('trackdetail',{
      url: '/tracks/:type/:id',
      cache:false,
      templateUrl: 'templates/trackdetail.html',
      controller: 'TrackDetailCtrl'
    })


    .state('trackingManager', {
      url: '/tracking/manager',
      cache:false,
      templateUrl: 'templates/track-manager.html',
      controller: 'TrackManagerCtrl'

    })


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        cache:false,
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          cache:false,
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.test',{
      url: '/test/:name',
      views: {
        'tab-test': {
          templateUrl: 'templates/test.html',
          controller: 'TestCtrl'
        }
      }
    })

  .state('tab.messages', {
      url: '/messages',
      resolve:{
        simpleObj:  function() {
          console.log("HOLA");
          return {value: 'simple!'};
        }
      },
      views: {
        'tab-messages': {
          templateUrl: 'templates/tab-messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('tab.message-detail', {
      url: '/messages/:name',
      views: {
        'tab-messages': {
          templateUrl: 'templates/message-detail.html',
          controller: 'MessageDetailCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');


});
