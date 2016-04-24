/**
 * Created by aitor on 19/4/16.
 */
angular.module('Flivess').controller('profileCtl', ['$scope', '$http', '$cookies', 'ModalService', function($scope, $http, $cookies, ModalService) {
    console.log("DENTRO DE CONTROLOADOR de profile.html");
    var base_url_prod="http://localhost:3000"
    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);
    var friend="pepe1";

    var refresh = function() {
        $http.get(base_url_prod+ '/friends/' + userLogged.username + "/" + friend).success(function (response) {
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
    refresh();


    $scope.addFriend = function () {
        console.log("Dentro de addFriend");
        var amigos = new Object();
        amigos.username = userLogged.username;
        amigos.friend = friend;
        $http.post(base_url_prod+'/addfriend', amigos).success(function(response) {
            console.log(response);
            $scope.show=false;
            console.log("EL SHOW:" + $scope.show);
        });
    }

    $scope.removeFriend = function () {
        console.log(id);
        $http.delete('/friend/' + id).success(function () {
            $scope.show=true;
            console.log("EL SHOW:" + $scope.show);
        });
    };

    $scope.showModel = function() {

        ModalService.showModal({
            templateUrl: "/views/modalMessage.html",
            controller: "modalMessageCtl",
            backdrop: true,
            inputs: {
                friend: friend
            }
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                sendMessage(result.message);
            });
        });

    };

    var sendMessage = function (msg) {
        var message = new Object();
        message.text = msg;
        message.sender = userLogged.username;
        message.receiver = friend;
        $http.post(base_url_prod+'/addmessage', message).success(function() {
        });
    }
}]);