var base_url_prod="http://localhost:3000";

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LoginCtrl',function($scope,$http,$state){
  console.log("DENTRO DE loginCtl");
  $scope.data={};
  $scope.login = function () {
    //console.log($scope.user);
    console.log($scope.data);
    $http.post('http://localhost:3000/login', $scope.data).then(function (response) {
      console.log(response);
      //$cookies.putObject('user', response);
      $state.go('tab.dash');
    },
    function(error){
      alert("ERROR");
    })
  }


})

.controller('MessagesCtrl',['$scope','$http', function($scope,$http) {
  console.log("messages");
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // PLANTILLA INICIAL/////
  /*
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };*/
  /////////////////////////////////////
  var getUsersInConversation = function() {
    $http.get(base_url_prod+ '/messages/pepe').success(function (response) {
      console.log(response);
      $scope.users = response;
    });
  }
  getUsersInConversation();





}])

.controller('MessageDetailCtrl',['$scope','$http','$stateParams', function($scope,$http,$stateParams) {
  //$scope.chat = Chats.get($stateParams.chatId);
  conversacion = function () {
    console.log($stateParams.name);
    $http.get(base_url_prod+ '/messages/pepe/'+$stateParams.name).success(function (response) {
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
}]);
