/**
 * Created by irkalla on 14.04.16.
 */
// configure our routes
angular.module('Flivess', ['ngRoute', 'ngCookies']).config(function($routeProvider) {
    console.log("EN ROUTES.JS");
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'home.html',
            controller  : 'loginCtl'
        })
        .when('/friends', {
            templateUrl : 'views/friends.html',
            controller  : 'friendsCtl'
        })

        .when('/messages', {
            templateUrl : 'views/messages.html',
            controller  : 'messagesCtl'
        })
        .when('/profile', {
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
});