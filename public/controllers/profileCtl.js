/**
 * Created by aitor on 19/4/16.
 */
angular.module('Flivess').controller('profileCtl', ['$scope', '$http', '$cookies', 'ModalService', '$routeParams', function($scope, $http, $cookies, ModalService, $routeParams) {
    console.log("DENTRO DE CONTROLOADOR de profile.html");
    var base_url_prod="http://localhost:3000"
    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);
    var friend= new Object();



    var refresh = function() {
        $http.get(base_url_prod+ '/users/user/' + $routeParams.friend).success(function (response) {

            friend = response[0];
            $scope.friend= friend;
            isFriend();

        });

    }
    refresh();


    $scope.addFriend = function () {
        console.log("Dentro de addFriend");
        var amigos = new Object();
        amigos.username = userLogged.username;
        amigos.friend = friend.username;
        $http.post(base_url_prod+'/addfriend', amigos).success(function(response) {
            isFriend();
        });
    }

    $scope.removeFriend = function () {
        $http.delete('/friend/' + userLogged.username + "/" + friend.username).success(function () {
            isFriend();
        });
    };

    $scope.showModel = function() {

        ModalService.showModal({
            templateUrl: "/views/modalMessage.html",
            controller: "modalMessageCtl",
            backdrop: true,
            inputs: {
                friend: friend.fullname
            }
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result.message!=null){
                    sendMessage(result.message);
                }
            });
        });

    };

    var sendMessage = function (msg) {
        var message = new Object();
        message.text = msg;
        message.sender = userLogged.username;
        message.receiver = friend.username;
        $http.post(base_url_prod+'/addmessage', message).success(function() {
        });
    }


    var isFriend = function () {
        $http.get(base_url_prod+ '/friends/' + userLogged.username + "/" + friend.username).success(function (response) {
            console.log(response);
            if(response==true){
                $scope.show=false;
                console.log("EL SHOW:" + $scope.show);
            }
            else{
                $scope.show=true;
                console.log("EL SHOW:" + $scope.show);
            }

        });
    }
}]);