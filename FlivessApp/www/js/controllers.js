var base_url_prod="http://147.83.7.157:8080";
var base_url_local="http://192.168.1.36:8080";


angular.module('starter.controllers', ['ngOpenFB'])

.controller('DashCtrl', function($scope) {})

.controller('LoginCtrl',function($scope,$http,$state,$localStorage,ngFB){

  $scope.redir = function() {
    $state.go('register');
  }

  console.log("DENTRO DE loginCtl");
  $scope.data={};
  $scope.login = function () {
    //console.log($scope.user);
    console.log($scope.data);
    $http.post(base_url_local+'/login', $scope.data).then(function (response) {
      console.log("RESPUESTA: "+response);
      console.log("USUARIO: "+response.data.username);
      localStorage.setItem('userLogged', JSON.stringify(response.data));
      console.log("LOCAL: "+$localStorage.username);
      //$cookies.putObject('user', response);
      $state.go('tab.dash');
    },
    function(error){
      alert("ERROR");
    })
  }


  $scope.loginFB = function() {
    ngFB.login({scope: 'email,publish_actions'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $localStorage.token=response.authResponse.accessToken;
          ngFB.api({
            path: '/me',
            params: {fields: 'id,name,email'}
          }).then(
            function (res) {
              console.log("COJO EL USUSARIO DE FB")
              var user = {
                username: res.name,
                fullname:res.name,
                email: res.email,
                imgurl: 'http://graph.facebook.com/'+res.id +'/picture?width=270&height=270',
                facebook_id: res.id

              };
              console.log("POST PARA COMPROBAR QUE ESTA EN LA BD")
              $http.post(base_url_local + '/user/', user).success(function (response){
                console.log("NO ESTA POR LO QUE SE AÑADE")
                console.log(response);
                localStorage.setItem('userLogged', JSON.stringify(response));
                $state.go('tab.dash');


              }).error(function (data,err) {
                console.log("EXISTE POR LO QUE HAGO EL GET Y LO GUARDO EN LA SESION")
                console.log(err);
                $http.get(base_url_local+'/users/user/'+res.name).success(function (response){
                  console.log(response);
                  console.log("ANTES DEL LOCAL");
                  localStorage.setItem('userLogged', JSON.stringify(response[0]));
                  console.log("DESPUES DEL LOCAL");
                  $state.go('tab.dash');
                }).error(function(response,err){
                  console.log(err);
                })

              });
            },
            function (error) {
              alert('Facebook error');
            });
        } else {
          alert('Facebook login failed');
        }
      });

  };


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
      $http.post(base_url_local+'/user', $scope.user).success(function(response){
        console.log($scope.user.username);
       // $cookies.putObject('user',response);
       // $scope.alert.message="";
        localStorage.setItem('userLogged', JSON.stringify($scope.user));
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
    var userLogged = JSON.parse(localStorage.getItem('userLogged'));
    console.log(userLogged);
    console.log(userLogged.username);
    console.log($stateParams.name);
    $http.get(base_url_local+ '/messages/'+userLogged.username+'/'+$stateParams.name).success(function (response) {
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
     var userLogged = JSON.parse(localStorage.getItem('userLogged'));
     console.log(userLogged);
     console.log(userLogged.username);
     $scope.users="";
     $http.get(base_url_local+ '/messages/'+userLogged.username).success(function (response) {
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
        localStorage.clear();
        console.log(localStorage.getItem('userLogged'));
        $state.go('login');
      } else {
        $state.go('tab.dash');
      }
    });
  }

});
