// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage','ngOpenFB','ngCordova','angularMoment'])

.run(['$rootScope', 'SocketIoFactory', '$ionicPlatform', '$state', '$stateParams', 'ngFB', function($rootScope,socket, $ionicPlatform,$state,$stateParams,ngFB,$scope) {
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

    if((localStorage.getItem('userLogged')!== null)) {
      console.log(JSON.parse(localStorage.getItem('userLogged')));
      console.log('entro en RUN');
      $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
      socket.connect();
      socket.on('connection', function(data){
        console.log(data);
        socket.emit('username',$rootScope.userLogged.username);
        socket.emit('notification',$rootScope.userLogged.username);
      });
      socket.on('listaUsers', function(data){
        console.log("LOS USUARIOS");
        console.log(data);
      });
      console.log("3");
      socket.on('new notification', function(data){
        socket.emit('notification',$rootScope.userLogged.username, function(data){
        } )
      });
      socket.on('notification', function(data){
        $rootScope.notlength=data.numeros;
        //$rootScope.notification=data.notifications;
        console.log(data);
      });

      socket.on('chat', function (data){

        console.log("CHAT");
        $rootScope.$emit('myEvent', function(event,viewData){
          console.log("EN EL BROADCAST");
        });
       // $state.go($state.currentState, {}, {reload:true});
        // $state.go($state.current, $state.$current.params, {reload: true});

      });
      $state.go('tab.dash');

    }
  });

}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      cache:false,
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      url: '/register',
      cache:false,
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })

    .state('registerFB', {
      url: '/registerFB/:userFB',
      cache:false,
      templateUrl: 'templates/registerFB.html',
      controller: 'RegisterFBCtrl'
    })

    .state('tracking',{
      url: '/tracking/:type/:trackoriginal',
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
      url: '/tracking/manager/:originalID',
      cache:false,
      templateUrl: 'templates/track-manager.html',
      controller: 'TrackManagerCtrl'

    })


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
      cache:false,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    cache:false,
    views: {
      cache:false,
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

    .state('tab.account', {
      url: '/account',
      cache:false,
      views: {
        'tab-account': {
          cache:false,
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.notifications', {
      url: '/notifications',
      cache:false,
      views: {
        'tab-notifications': {
          templateUrl: 'templates/tab-notifications.html',
          controller: 'NotificationsCtrl'
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
    cache:false,
      views: {
        'tab-messages': {
          templateUrl: 'templates/tab-messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('tab.message-detail', {
      url: '/messages/:name',
      cache:false,
      views: {
        'tab-messages':{
          templateUrl: function(){
            if(ionic.Platform.isAndroid()){
              return "templates/message-detail.html"
            }
            return "templates/message-detail-ios.html"
          } ,
          controller: 'MessageDetailCtrl'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');


})

.factory("SocketIoFactory", function ($rootScope) {
  var socket = null;
  var nodePath = "http://147.83.7.157:3000/";

  function listenerExists(eventName) {
    return socket.hasOwnProperty("$events") && socket.$events.hasOwnProperty(eventName);
  }

  return {
    connect: function () {
      socket = io.connect(nodePath);
    },
    connected: function () {
      return socket != null;
    },
    on: function (eventName, callback) {
      console.log("INSIDE ON");
      socket.on(eventName, function () {
        console.log("INSIDE ON IN ON");
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      console.log("INSIDE EMIT");
      socket.emit(eventName, data, function () {
        console.log("INSIDE EMIT IN EMIT");
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    disconnect: function () {
      socket.disconnect();
    }
  };
});
