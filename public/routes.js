/**
 * Created by irkalla on 14.04.16.
 */
// configure our routes
angular.module('Flivess', ['ngRoute', 'ngCookies','ui.bootstrap','angularModalService', 'ngAnimate', 'googlechart']).config(function($routeProvider) {
    console.log("EN ROUTES.JS");
    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl : 'views/login.html',
            controller  : 'loginCtl'
        })

        .when('/friends', {
            templateUrl : 'views/following.html',
            controller  : 'friendsCtl'
        })

        .when('/messages', {
            templateUrl : 'views/messages.html',
            controller  : 'messagesCtl'
        })

        .when('/editprofile', {
            templateUrl : 'views/profileEdit.html',
            controller  : 'profileEditCtl'
        })

        .when('/profile/:friend', {
            templateUrl : 'views/profile.html',
            controller  : 'profileCtl'
        })

        .when('/register', {
            templateUrl : 'views/register.html',
            controller  : 'registerCtl'
        })

        .when('/home', {
            templateUrl : 'views/home.html',
            controller  : 'homeCtl'
        })

        .when('/home/:facebook_id', {
            templateUrl : 'views/home.html',
            controller  : 'homeFacebookCtl'
        })

        .when('/contact', {
            templateUrl : 'views/contact.html'
        })

        .when('/about', {
            templateUrl : 'views/about.html'
        })

        .when('/details/:id', {
            templateUrl : 'views/raceDetails.html',
            controller  : 'raceDetailsCtl'
        })
})
    .run(function ($rootScope, $cookies) {
        if(angular.isUndefined($cookies.getObject('user'))){
            $rootScope.isLogged=false;
        }
        else{
            $rootScope.userlog = $cookies.getObject('user');
            $rootScope.isLogged=true;
            console.log("Holiii" +$rootScope.userlog.username);
        }
    });