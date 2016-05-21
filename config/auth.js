/*
* Configuration data for different passport strategies
*/


module.exports = {

    'facebookAuth' : {
        'clientID'      : '171606643237841', // your App ID
        'clientSecret'  : 'addf642fa430a874dfc15f07284c5412', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        //'callbackURL'   : 'http://147.83.7.157:8080/auth/facebook/callback',
         'profileFields': ['id', 'displayName', 'photos', 'emails']
    }
};