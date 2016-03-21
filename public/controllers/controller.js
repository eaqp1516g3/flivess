//un scope es  un objeto que  hace de enlace entre las vistas y los controladores.
/*function AppCtrl ($scope, $http){
	console.log("hola mundo desde el primer controlador");*/

var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");



	var refresh=function(){
		$http.get('/allusers').success(function (response){//Esta es la primera linea que ejecuta el navegador y lo primero que hace es una peticicion al nodejs 
			// o mejor ducho, le manda la peticion a la api que se encuentra en el severjs.

			console.log("ya tengo los datos de la request");

			$scope.users=response;
			$scope.contact ="";// para que limpie todo lo que se llame contact.
		});
    };
	
	refresh();

	$scope.addContact= function(){
		console.log($scope.contact);
		$http.post('/users', $scope.contact).success(function(response){
		   console.log(response);
		   refresh(); 
		});
	};
	$scope.remove=function(id){
		console.log(id);
		$http.delete('/users/' + id).success(function(response){
			$scope.contact=response;
			refresh();
		});
	};

	$scope.edit=function(id){
		console.log(id);
		$http.get('/users/'+ id).success(function(response){
			$scope.contact=response;
		});
	};

	$scope.update= function(){
		console.log($scope.contact._id);
		$http.put('/users/'+$scope.contact._id, $scope.contact).success(function(response){
			refresh();
		});
	};

	$scope.deselect= function(){

		$scope.contact ="";

	};

}]);
