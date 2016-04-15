/**
 * Created by irkalla on 14.04.16.
 */
// configure our routes
angular.module('Flivess', ['ngRoute']).config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'homeCtl'
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
            controller  : 'backOfficeCtl'
        })
        .otherwise({
            redirectTo: '/views/home.html'
    });

});