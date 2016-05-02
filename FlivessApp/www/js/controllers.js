var base_url_prod="http://147.83.7.157:8080";
var num = 1;

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LoginCtrl',function($scope,$http,$state,$localStorage){

  $scope.redir = function() {
    $state.go('register');
  }

  console.log("DENTRO DE loginCtl");
  $scope.data={};
  $scope.login = function () {
    //console.log($scope.user);
    console.log($scope.data);
    $http.post(base_url_prod+'/login', $scope.data).then(function (response) {
      console.log("RESPUESTA: "+response);
      console.log("USUARIO: "+response.data.username);
      $localStorage.username=response.data.username;
      console.log("LOCAL: "+$localStorage.username);
      //$cookies.putObject('user', response);
      $state.go('tab.dash');
    },
    function(error){
      alert("ERROR");
    })
  }


})

.controller('RegisterCtrl',function($scope,$http,$state,$ionicPopup,$localStorage){


  $scope.user={};
  $scope.data={};

  $scope.register = function(){


    console.log($scope.user);
    console.log($scope.data.confirma);
    //console.log($scope.);
    console.log("USUARIO: " + $scope.user);
    if($scope.user.password == $scope.data.confirma && !angular.isUndefined($scope.user.username) && !angular.isUndefined($scope.user.email) && !angular.isUndefined($scope.user.password)){
      $http.post(base_url_prod+'/user', $scope.user).success(function(response){
        console.log($scope.user.username);
       // $cookies.putObject('user',response);
       // $scope.alert.message="";
        $localStorage.username=$scope.user.username;
        console.log($localStorage.username);
        $scope.user="";
        $state.go('tab.dash');
      }).error(function (response) {
        //$scope.alertReg = true;
        //$scope.alert.message="Username already exists";
        $ionicPopup.alert({
          title: 'Error',
          template: 'Username already exists'
        });

      });

    }
    else if(angular.isUndefined($scope.user.username)||angular.isUndefined($scope.user.email) || angular.isUndefined($scope.user.password)){
      //$scope.alertReg = true;
      //$scope.alert.message= "Fields uncomplete";
       $ionicPopup.alert({
        title: 'Error',
        template: 'Fields uncomplete'
      });


    }

    else if($scope.user.password != $scope.data.confirma){
      //$scope.alertReg=true;
      //$scope.alert.message="Passwords dont match";
      $ionicPopup.alert({
        title: 'Error',
        template: 'Passwords don\'t match'
      });

    }

  };


  /*$scope.closeAlert=function(){
    $scope.alertReg=false;
    $scope.alert.message="";
  }*/

})

.controller('MessagesCtrl',['$scope','$http','$localStorage','$state','$stateParams','$rootScope','simpleObj', function($scope,$http,$localStorage,$state,$stateParams,$rootScope, simpleObj) {
  //$window.location.reload();



  $scope.detail=function(username){
    $state.go('tab.message-detail',{name:username});
  }

  $scope.hello = function() {
    console.log(simpleObj);
    console.log();
  }









}])

.controller('MessageDetailCtrl',['$scope','$http','$stateParams','$localStorage', function($scope,$http,$stateParams,$localStorage) {
  //$scope.chat = Chats.get($stateParams.chatId);
  conversacion = function () {
    console.log($stateParams.name);
    $http.get(base_url_prod+ '/messages/'+$localStorage.username+'/'+$stateParams.name).success(function (response) {
      console.log("Messages received");
      console.log(response);
      console.log(response[0].sender.username);
      //$scope.usuarioC = user;
      $scope.msgs = response;
    });
  }

  conversacion();



}])



.controller('TestCtrl',['$scope','$http','$stateParams', function($scope,$http){
console.log("estoy dentro");
  getUsersInConversation = function() {
    $http.get(base_url_prod+ '/users/user/'+ stateParams.name).success(function (response) {
      console.log(response);
      $scope.user = response;
    });
  }
  getUsersInConversation();
}])

.controller('TabCtrl', function($scope,$http,$localStorage,$ionicPopup,$state){

  $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      console.log("STATE CHANGE START");
    });


   $scope.messages = function() {
     console.log("USUARIO: "+$localStorage.username)
     $scope.users="";
     $http.get(base_url_prod+ '/messages/'+$localStorage.username).success(function (response) {
       console.log(response);
       $scope.users = response;
       $scope.user="";

     });
     $state.go('tab.messages');
  }


  $scope.logout = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Salir de Flivess',
      template: 'Estas seguro que quieres salir?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $localStorage.username="";
        console.log($localStorage.username);
        $state.go('login');
      } else {
        $state.go('tab.dash');
      }
    });
  }

});
