var base_url_local="http://147.83.7.157:8080";


//var base_url_local="http://localhost:8080";



angular.module('starter.controllers', ['ngOpenFB'])

.factory('UsersDataService', function($q, $timeout, $http) {

    var users;
    var getUsers = function(){
      $http.get(base_url_local + '/allusers/').success(function(data) {
        console.log("Obtengo users");
        console.log(data);
        users=data;

        users = users.sort(function(a, b) {

          var userA = a.username.toLowerCase();
          var userB = b.username.toLowerCase();

          if(userA > userB) return 1;
          if(userA < userB) return -1;
          return 0;

        });

      });
    }

    getUsers();

    var searchUsers = function(searchFilter) {

      console.log('Searching users for ' + searchFilter);

      var deferred = $q.defer();

      var matches = users.filter( function(user) {
        if(user.username.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 || user.fullname.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
      })

      $timeout( function(){

        deferred.resolve( matches );

      }, 100);

      return deferred.promise;

    };

    return {

      searchUsers : searchUsers,
      getUsers : getUsers

    }
  })

.controller('DashCtrl', function($scope,$state,$http,$ionicHistory,$ionicLoading,$timeout,$q) {

  $ionicHistory.clearHistory();



  var userLogged = JSON.parse(localStorage.getItem('userLogged'));

  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.trackDetail = function(trackid){
    $state.go('trackdetail',{type:'profile',id:trackid});
  };


  $scope.toNotifications= function(){
    $state.go('notifications');
  };

  $scope.toSearch= function(){
    $state.go('search');
  };


  var main = function(){
    var promises=[];
    console.log("estoy en el main");
    $http.get(base_url_local + '/tracks/friends/' + userLogged.username).success(function(data){
      console.log("PRIMER GET");

      console.log(data);
      if(data=="") {
        console.log("DENTRO DEL NO FOLLOWING");
        $scope.noFollowing = true;
      }
      angular.forEach(data,function(d){
        //console.log("EN EL FOREACH");
        //console.log(d.pointsurl);
        var deffered  = $q.defer();
        $http.get(d.pointsurl).success(function(datos){
          //console.log("GET");
          deffered.resolve(datos);
          console.log(deffered.promise);

        });
        //console.log("PUSH");
        promises.push(deffered.promise);
        console.log(promises);
      });
      console.log("PROMISES");
      console.log($q.all(promises));
      $q.all(promises).then(function(results){
        console.log("ALL");
        console.log(results);
        console.log(data);
        var int=0;
        for (var i = 0; i < data.length; i++) {

          var final_time_m = Math.floor(data[i].time / 60);
          var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
          data[i].time =final_time_m+' min '+final_time_s+' s';

          if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
          else data[i].distance=data[i].distance + ' Km';

          if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

          for (var a = 0; a < results[i].length; a++) {
            if (a == 0) data[int].path = results[i][a].latitude + "," + results[i][a].longitude;
            else data[int].path += "|" + results[i][a].latitude + "," + results[i][a].longitude;
          }
          data[int].center = results[i][1].latitude + "," + results[i][1].longitude;
          var marker1 = results[i][0].latitude + "," + results[i][0].longitude;
          var marker2 = results[i][results[i].length -1].latitude + "," + results[i][results[i].length -1].longitude;

          //strokeColor: "#FF0000",
          //strokeOpacity: 0.7,
          //strokeWeight: 3
          data[int].img="http://maps.googleapis.com/maps/api/staticmap?center="+data[int].center+"&zoom=17scale=1&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
          //zoom:17
          //mapTypeId: google.maps.MapTypeId.ROADMAP
          int++;


        }
        console.log("FINSIH");
        $scope.routes = data;
        console.log(data);
      });
    });


  };
  main();
  /*$http.get(base_url_local+ '/tracks/friends/' + userLogged.username).success(function (data) {
    console.log('ME LLEGA: ');
    console.log(data);
    if(data=="") {
      $scope.noAct = true;
    }
    else{

      var int=0;
      for (var i = 0; i < data.length; i++) {
        var final_time_m = Math.floor(data[i].time / 60);
        var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
        data[i].time =final_time_m+' min '+final_time_s+' s';

        if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
        else data[i].distance=data[i].distance + ' Km';

        if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

        $http.get(data[i].pointsurl).success(function (datos) {
          console.log(int);
          for (var i = 0; i < datos.length; i++) {
            if (i == 0) data[int].path = datos[i].latitude + "," + datos[i].longitude;
            else data[int].path += "|" + datos[i].latitude + "," + datos[i].longitude;
          }
          data[int].center = datos[1].latitude + "," + datos[1].longitude;
          var marker1 = datos[0].latitude + "," + datos[0].longitude;
          var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;
          data[int].img="http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center+"&zoom=12&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
          console.log(data[int].img);
          int++;
        });
      }
      console.log(data);
      $scope.routes = data;
    }
  });*/


  $ionicLoading.show();

  $timeout(function () {
    $ionicLoading.hide();
  }, 1500);



})

.controller('NotificationsCtrl', function ($scope, $http,$state,$rootScope) {

  $scope.toTrack = function(){
    $state.go('selecter');
  };

  $scope.toSearch= function(){
    $state.go('search');
  }

  $scope.notifications = '';
  $http.get(base_url_local + '/notifications/user/' + $scope.userLogged.username).success(function (response) {
    console.log(response);
    $scope.notifications = response;
  });


  $scope.profile = function(username){
    $state.go('profile',{username:username});
  };

  $scope.messages = function(username){
    $state.go('tab.message-detail',{name:username});
  };

  $scope.eliminarNotis = function () {
    $http.delete(base_url_local + '/notifications/' + $scope.userLogged.username + '/all').success(function () {
      $state.go('tab.dash');
      $rootScope.notlength=0;
      $rootScope.notification="";
    });
  };



})

.controller('ProfileCtrl', ['$scope','$q', '$http', '$state', '$ionicPopup', '$ionicActionSheet', '$stateParams', '$anchorScroll', '$location', '$ionicLoading' ,'$timeout', '$ionicScrollDelegate', '$ionicHistory', 'SocketIoFactory', function($scope,$q,$http,$state,$ionicPopup,$ionicActionSheet,$stateParams,$anchorScroll,$location,$ionicLoading,$timeout,$ionicScrollDelegate,$ionicHistory, socket) {

  $scope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
  $scope.showActionSheet = function() {// Show the action sheet

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Send message' }
      ],
      cancelText: '<span >Cancel</span>',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        if(index===0){
          $state.go('tab.message-detail',{name:$stateParams.username});
        }

      }
    });};

  $scope.toFollowing = function(user){
    $state.go('friends',{type:'following',username:user});
  };

  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.toSearch= function(){
    $state.go('search');
  };

  $scope.toFollowers = function(user){
    $state.go('followers',{username:user});
  };

  $scope.trackdetail= function(trackid){
    $state.go('trackdetail',{type:'profile',id:trackid});
  };


  var friend= new Object();

  var refresh = function(){
    $http.get(base_url_local + '/users/user/' + $stateParams.username).success(function (response) {

      friend = response[0];
      $scope.friend = friend;

      console.log(friend.username);
      isFriend();

      if(angular.isUndefined($scope.friend.level)){
        $scope.friend.level = '0';
      }

    });
    $http.get(base_url_local + '/tracks/num/' + $stateParams.username).success(function (response) {

      $scope.ntracks = response;
    });
    $http.get(base_url_local + '/nfollowing/' + $stateParams.username).success(function (response) {

      $scope.nfollowing = response;
    });
    $http.get(base_url_local + '/nfollowers/' + $stateParams.username).success(function (response) {

      $scope.nfollowers = response;
    });
  }

  refresh();

  $scope.follow = function () {
    console.log("Dentro de addFriend");
    var amigos = new Object();
    amigos.username = $scope.userLogged.username;
    console.log($scope.userLogged.username);
    amigos.friend = $stateParams.username;
    console.log($stateParams.username);
    console.log("Lo que envio " + amigos)
    $http.post(base_url_local+'/addfriend', amigos).success(function(response) {
      socket.emit('follow', amigos.friend);
      isFriend();
      refresh();
    });
  }

  $scope.unfollow = function () {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Unfollow '+ $scope.friend.username + ' ?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $http.delete(base_url_local+'/friend/' + $scope.userLogged.username + "/" + $scope.friend.username).success(function () {
          isFriend();
          refresh();
        });
      } else {
        console.log('You are not sure');
      }
    });

  };

  var isFriend = function () {
    $http.get(base_url_local+ '/friends/' + $scope.userLogged.username + "/" + $scope.friend.username).success(function (response) {
      console.log(response);
      if(response==true){
        $scope.isfriend=true;
      }
      else{
        $scope.isfriend=false;
      }

    });
  }

  $scope.goback = function(){

    $ionicHistory.goBack();

  };

  $scope.editProfile = function(){

    $state.go('editprofile');

  };

  $scope.goTracksArea = function() {
    // set the location.hash to the id of
    // the element you wish to scroll to.
    //$ionicScrollDelegate.anchorScroll('trackArea');

    if($scope.userLogged.username != $stateParams.username)
    {
      $location.hash('trackArea');

      $ionicScrollDelegate.anchorScroll()
    }
  }

  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 500);

  }

  var main = function(){
    $scope.routes='';
    var promises=[];

    if($scope.userLogged.username != $stateParams.username) {
      $http.get(base_url_local + '/tracks/' + $stateParams.username).success(function (data) {
        console.log(data);
        if (data == "") {
          $scope.noTracks = true;
        }
        else {

            console.log("estoy en el main");
            console.log("PRIMER GET");

            console.log(data);
            if (data == "") {
              console.log("DENTRO DEL NO FOLLOWING");
              $scope.noFollowing = true;
            }
            angular.forEach(data, function (d) {
              //console.log("EN EL FOREACH");
              //console.log(d.pointsurl);
              var deffered = $q.defer();
              $http.get(d.pointsurl).success(function (datos) {
                //console.log("GET");
                deffered.resolve(datos);
                console.log(deffered.promise);

              });
              //console.log("PUSH");
              promises.push(deffered.promise);
              console.log(promises);
            });
            console.log("PROMISES");
            console.log($q.all(promises));
            $q.all(promises).then(function (results) {
              console.log("ALL");
              console.log(results);
              console.log(data);
              var int = 0;
              for (var i = 0; i < data.length; i++) {

                var final_time_m = Math.floor(data[i].time / 60);
                var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
                data[i].time = final_time_m + ' min ' + final_time_s + ' s';

                if (data[i].distance < 1) data[i].distance = data[i].distance * 1000 + ' m';
                else data[i].distance = data[i].distance + ' Km';

                if (data[i].avg_speed > 0) data[i].avg_speed = Math.floor(60 / (data[i].avg_speed)).toFixed(2);

                for (var a = 0; a < results[i].length; a++) {
                  if (a == 0) data[int].path = results[i][a].latitude + "," + results[i][a].longitude;
                  else data[int].path += "|" + results[i][a].latitude + "," + results[i][a].longitude;
                }
                data[int].center = results[i][1].latitude + "," + results[i][1].longitude;
                var marker1 = results[i][0].latitude + "," + results[i][0].longitude;
                var marker2 = results[i][results[i].length - 1].latitude + "," + results[i][results[i].length - 1].longitude;

                //strokeColor: "#FF0000",
                //strokeOpacity: 0.7,
                //strokeWeight: 3
                data[int].img = "http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center + "&zoom=17scale=1&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|" + data[int].path + "&sensor=false&markers=color:blue%7Clabel:S%7C" + marker1 + "&markers=color:red%7Clabel:F%7C" + marker2;
                //zoom:17
                //mapTypeId: google.maps.MapTypeId.ROADMAP
                int++;


              }
              console.log("FINSIH");
              $scope.routes = data;
              console.log(data);
            });
          }

        });
    }





  };






  main();

 /* var getTracks = function(){
    $scope.routes='';

    if($scope.userLogged.username != $stateParams.username){
      $http.get(base_url_local + '/tracks/' + $stateParams.username).success(function (data) {
        console.log(data);
        if(data=="") {
          $scope.noTracks = true;
        }
        else{
          var int=0;
          for (var i = 0; i < data.length; i++) {
            var final_time_m = Math.floor(data[i].time / 60);
            var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
            data[i].time =final_time_m+' min '+final_time_s+' s';

            if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
            else data[i].distance=data[i].distance + ' Km';

            if (data[i].avg_speed>0) (data[i].avg_speed= 1/data[i].avg_speed)*60;

            $http.get(data[i].pointsurl).success(function (datos) {
              for (var i = 0; i < datos.length; i++) {
                if (i == 0) data[int].path = datos[i].latitude + "," + datos[i].longitude;
                else data[int].path += "|" + datos[i].latitude + "," + datos[i].longitude;
              }
              data[int].center = datos[1].latitude + "," + datos[1].longitude;
              var marker1 = datos[0].latitude + "," + datos[0].longitude;
              var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;


              data[int].img="http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center+"&zoom=17&size=425x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
              int++;
            });
          }
          console.log(data);
          $scope.routes = data;
        }
      });
    }
  };

  getTracks();*/


}])

.controller('SearchCtrl', ['$scope', 'UsersDataService','$ionicHistory','$state','$ionicLoading','$timeout', function($scope, UsersDataService,$ionicHistory,$state,$ionicLoading,$timeout) {

  $scope.profile = function(username){
    $state.go('profile',{username:username});
  }

  $scope.goback= function(){
    $state.go('tab.dash');
  }

  $scope.data = { "users" : [], "search" : '' };

    $scope.search = function() {

      var loading = function(){
        $ionicLoading.show();

        $timeout(function () {
          $ionicLoading.hide();
        }, 300);

      }
      loading();

      UsersDataService.getUsers();

      UsersDataService.searchUsers($scope.data.search).then(
        function(matches) {
          $scope.data.users = matches;
        }
      )
    }

}])

.controller('EditProfileCtrl', ['$scope','$ionicHistory','$state','$http','$ionicPopup','$ionicLoading','$timeout','$rootScope', function($scope,$ionicHistory,$state,$http,$ionicPopup) {


  var userLogged = JSON.parse(localStorage.getItem('userLogged'));
  console.log(userLogged);
  $scope.range_weight = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  $scope.range_height = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };
  $scope.range_age = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };
  $scope.data={};
  $scope.user={};
  $http.get(base_url_local + '/users/user/' + userLogged.username).success(function(response){
   console.log(response);
    $scope.user = response[0];


  });

  $scope.goback= function(){
      $ionicHistory.goBack();
  };

  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.toSearch= function(){
    $state.go('search');
  };

  /*$scope.updateUser = function() {
    if($scope.user.password == $scope.data.confirma && !angular.isUndefined($scope.user.password)){

      $http.put(base_url_local +'/user/' + $scope.user._id, $scope.user).success(function (response) {
        $ionicHistory.goBack();
      })
    }
    else {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Password is empty or doesn\'t match'
      });

    }
  $scope.updateUser = function(){



  };*/

  $scope.updateUser = function(){
    console.log($scope.user._id);
    console.log($scope.user.oldpassword);
    console.log($scope.user.newpassword);
    console.log($scope.data.newpassword);
    var oldpassword = $scope.user.oldpassword;
    var newpassword = $scope.user.newpassword;
    var confirm = $scope.data.newpassword;
    if(newpassword  || confirm  || oldpassword){
      if(($scope.data.newpassword == $scope.user.newpassword) && (!angular.isUndefined($scope.user.oldpassword)) && (!angular.isUndefined($scope.data.newpassword)) && (!angular.isUndefined($scope.user.newpassword)) ){
        console.log("TODO CORRECTO, HAGO EL PUT");
        $http.put(base_url_local + '/user/' + $scope.user._id, $scope.user).success(function (response) {
          $ionicHistory.goBack();
        }).error(function(data,err){
          console.log("ERROR");
          $ionicPopup.alert({
            title: 'Error',
            template: 'old passwords doesn\'t match'
          });
        });
      }
      else if(($scope.data.newpassword != $scope.user.newpassword) && (!angular.isUndefined($scope.user.oldpassword))){
        console.log(" LOS NUEVOS PASS NO COINCIDEN");
        $ionicPopup.alert({
          title: 'Error',
          template: 'new passwords doesn\'t match'
        });
      }
      else{
        console.log("FALTA ALGUN PARAMETRO");
        $ionicPopup.alert({
          title: 'Error',
          template: 'Password fields uncomplete'
        });
      }
    }
    else{
      console.log('normal');
      $http.put(base_url_local + '/user/' + $scope.user._id, $scope.user).success(function (response) {
        $ionicHistory.goBack();
      });
    }


  };



  }])

.controller('AccountCtrl',['$scope','$ionicPopup','$state','$ionicLoading','$timeout','SocketIoFactory', function($scope,$ionicPopup,$state,$ionicLoading,$timeout,socket) {

  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 600);

  }

  $scope.loading2 = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 1500);

  }


  $scope.myprofile = function(){
    var userLogged = JSON.parse(localStorage.getItem('userLogged'));
    $state.go('profile',{username:userLogged.username});
  }

  $scope.mytracks = function(){
    var userLogged = JSON.parse(localStorage.getItem('userLogged'));
    $state.go('tracksUser',{username:userLogged.username});
  }

  $scope.toSearch= function(){
    $state.go('search');
  }


  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.logout = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Exit Flivess',
      template: 'Are you sure?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        localStorage.clear();
        console.log(localStorage.getItem('userLogged'));
        socket.disconnect();
        $state.go('login');
      } else {
        $state.go('tab.account');
      }
    });
  }


  }])

.controller('TracksUserCtrl', function($http,$scope,$ionicPopup,$state,$stateParams,$ionicHistory,$q) {


  var main = function(){
    var promises=[];
    console.log("estoy en el main");
    $http.get(base_url_local + '/tracks/' + $stateParams.username).success(function(data){
      console.log("PRIMER GET");

      console.log(data);
      if(data=="") {
        console.log("DENTRO DEL NO FOLLOWING");
        $scope.noFollowing = true;
      }
      angular.forEach(data,function(d){
        //console.log("EN EL FOREACH");
        //console.log(d.pointsurl);
        var deffered  = $q.defer();
        $http.get(d.pointsurl).success(function(datos){
          //console.log("GET");
          deffered.resolve(datos);
          console.log(deffered.promise);

        });
        //console.log("PUSH");
        promises.push(deffered.promise);
        console.log(promises);
      });
      console.log("PROMISES");
      console.log($q.all(promises));
      $q.all(promises).then(function(results){
        console.log("ALL");
        console.log(results);
        console.log(data);
        var int=0;
        for (var i = 0; i < data.length; i++) {

          var final_time_m = Math.floor(data[i].time / 60);
          var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
          data[i].time =final_time_m+' min '+final_time_s+' s';

          if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
          else data[i].distance=data[i].distance + ' Km';

          if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

          for (var a = 0; a < results[i].length; a++) {
            if (a == 0) data[int].path = results[i][a].latitude + "," + results[i][a].longitude;
            else data[int].path += "|" + results[i][a].latitude + "," + results[i][a].longitude;
          }
          data[int].center = results[i][1].latitude + "," + results[i][1].longitude;
          var marker1 = results[i][0].latitude + "," + results[i][0].longitude;
          var marker2 = results[i][results[i].length -1].latitude + "," + results[i][results[i].length -1].longitude;

          //strokeColor: "#FF0000",
          //strokeOpacity: 0.7,
          //strokeWeight: 3
          data[int].img="http://maps.googleapis.com/maps/api/staticmap?center="+data[int].center+"&zoom=17scale=1&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
          //zoom:17
          //mapTypeId: google.maps.MapTypeId.ROADMAP
          int++;


        }
        console.log("FINSIH");
        $scope.routes = data;
        console.log(data);
      });
    });


  };
  main();

  /*var getTracks = function(){

      $http.get(base_url_local + '/tracks/' + $stateParams.username).success(function (data) {
        console.log(data);
        if(data=="") {
          $scope.noTracks = true;
        }
        else{
          var int=0;
          for (var i = 0; i < data.length; i++) {
            var final_time_m = Math.floor(data[i].time / 60);
            var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
            data[i].time =final_time_m+' min '+final_time_s+' s';

            if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
            else data[i].distance=data[i].distance + ' Km';

            if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

            $http.get(data[i].pointsurl).success(function (datos) {
              for (var i = 0; i < datos.length; i++) {
                if (i == 0) data[int].path = datos[i].latitude + "," + datos[i].longitude;
                else data[int].path += "|" + datos[i].latitude + "," + datos[i].longitude;
              }
              data[int].center = datos[1].latitude + "," + datos[1].longitude;
              var marker1 = datos[0].latitude + "," + datos[0].longitude;
              var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;

              //strokeColor: "#FF0000",
              //strokeOpacity: 0.7,
              //strokeWeight: 3
              data[int].img="http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center+"&zoom=17&size=425x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
              //zoom:17
              //mapTypeId: google.maps.MapTypeId.ROADMAP
              int++;
            });
          }
          console.log(data);
          $scope.routes = data;
        }
      });

  };

  getTracks();*/

  $scope.trackdetail= function(trackid){
    $state.go('trackdetail',{type:'profile',id:trackid});
  };

  $scope.goback= function(){
    $ionicHistory.goBack();
  }

  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.toSearch= function(){
    $state.go('search');
  };


  })

.controller('TrackingCtrl',['$scope','$http','$cordovaGeolocation','$ionicPlatform','$state','$ionicPopup','$ionicLoading','$timeout','$stateParams', function($scope,$http,$cordovaGeolocation,$ionicPlatform,$state,$ionicPopup,$ionicLoading,$timeout,$stateParams) {

  console.log("EN EL TRACKINGCTRL");
  console.log('En tracking con este track:');
  //console.log(JSON.parse($stateParams.trackoriginal));
  $scope.distancia = '';
  $scope.velocidad = '';
  $scope.tiempo = '';
  $scope.boton_start = true;
  $scope.boton_stop = false;
  $scope.boton_cancelar = true;
  $scope.boton_envio = false;

  var userLogged = JSON.parse(localStorage.getItem('userLogged'));
  var track_id ='';      // Name/ID of the exercise
  var tracking_data = []; // Array containing GPS position objects
  var options = {
    timeout: 10000,
    enableHighAccuracy: true,
  };
  //Get plugin
  var bgLocationServices =  window.plugins.backgroundLocationServices;

  //////////////////////////CONFIGURACION DEL PLUGIN Y CALLBACK SUCCESS///////////////////////////////////

  //Congfigure Plugin
  bgLocationServices.configure({
    //Both
    desiredAccuracy: 10, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
    distanceFilter: 1, // (Meters) How far you must move from the last point to trigger a location update
    debug: false, // <-- Enable to show visual indications when you receive a background location update
    interval: 5000, // (Milliseconds) Requested Interval in between location updates.
    fastestInterval: 5000,


  });

  bgLocationServices.registerForLocationUpdates(function(location) {
    console.log("We got an BG Update" + JSON.stringify(location));
    tracking_data.push(location);
  }, function(err) {
    console.log("Error: Didnt get an update", err);
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////FUNCIONES TRACKING & OPERACIONES DE PARAMETROS DEL TRACK////////////////////////////////////////////////////

  function gps_distance(lat1, lon1, lat2, lon2)
  {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $ionicPlatform.ready(function() {



      $scope.start = function () {
        $scope.boton_start = false;
        $scope.boton_stop = true;
        $scope.boton_cancelar = false;
        $scope.boton_envio = false;
        tracking_data = [];
        $scope.distancia = '';
        $scope.velocidad = '';
        $scope.tiempo = '';
        $scope.tracking_state = 'Recording.. Click STOP to finish'
        console.log("ARRAY AL INICIAR EL TRACK:  " + tracking_data);
        $cordovaGeolocation.getCurrentPosition().then(
          function (position) {
            console.log("TENGO LA POSICION!");
            tracking_data = [];
            track_id = Date.now();
            bgLocationServices.start();
          });
      }


      $scope.loading = function(){
        $ionicLoading.show();

        $timeout(function () {
          $ionicLoading.hide();
      }, 2000);

    }

      $scope.stop_track = function(){

        $scope.boton_start = true;
        $scope.boton_stop = false;
        $scope.boton_cancelar = true;
        $scope.boton_envio = true;
        $scope.tracking_state = '';
        bgLocationServices.stop();
        window.localStorage.setItem(track_id, JSON.stringify(tracking_data));
        console.log(tracking_data.length);
        if (tracking_data.length < 2) {
          $ionicPopup.alert({
            title: 'Not tracking...',
            template: 'Feeling lazy today? there are not points tracked!' +
            '    (Be sure your GPS is on)'
          });
          $state.go('tab.dash');

        }
        else {

          var loading = function(){
            $ionicLoading.show();

            $timeout(function () {
              $ionicLoading.hide();
            }, 2000);

          }
          $scope.loading();
          //$scope.data=tracking_data.length;

          // Calculate the total distance travelled
          //    &
          //Calcular la velocidad media de la ruta
          avg_speed = 0;
          total_km = 0;

          for (i = 0; i < tracking_data.length; i++) {

            if (i == (tracking_data.length - 1)) {
              break;
            }

            total_km += gps_distance(tracking_data[i].latitude, tracking_data[i].longitude, tracking_data[i + 1].latitude, tracking_data[i + 1].longitude);
            if (tracking_data[i].speed > 0) {
              avg_speed += tracking_data[i].speed;
            }
          }
          console.log("VELOCIDAD MEDIA(m/s): " + avg_speed);
          console.log("DISTANCIA SIN REDONDEO: " + total_km);
          total_km_rounded = total_km.toFixed(2);
          avg_speed_norm = avg_speed / tracking_data.length;
          avg_speed_km = (avg_speed_norm * 3.6);
          avg_speed_rounded = avg_speed_km.toFixed(1);

          //$scope.distancia = total_km_rounded; // mostrar en la pantalla
          //$scope.velocidad = avg_speed_rounded;


          // Calculate the total time taken for the track

          start_time = new Date(tracking_data[0].timestamp).getTime();
          end_time = new Date(tracking_data[tracking_data.length - 1].timestamp).getTime();

          total_time_ms = end_time - start_time;
          total_time_s = total_time_ms / 1000;

          final_time_m = Math.floor(total_time_s / 60);
          final_time_s = Math.floor(total_time_s - (final_time_m * 60));
          console.log("total minutos  " + final_time_m);
          console.log("total segundos" + final_time_s);
          // $scope.tiempo_minutos = final_time_m;
          // $scope.tiempo_segundos = final_time_s;

          $scope.distancia = 'DISTANCIA: ' + total_km_rounded + ' Km';
          $scope.velocidad = 'VELOCIDAD MEDIA: ' + avg_speed_rounded + ' Km/h';
          $scope.tiempo = 'TIEMPO: ' + final_time_m + ' Minutos y ' + final_time_s + ' Segundos';

          //tracking_data=[];
          console.log("ARRAY DESPUES DEL STOP: " + tracking_data);
          console.log('Tengo: '+$stateParams.id+' '+$stateParams.id_comun+' '+$stateParams.distance);

          var trackSt;

          if($stateParams.type=='near'){

            console.log('TIPO NEAR')

            var rutaOrg = JSON.parse($stateParams.trackoriginal);
            console.log('rutaOrg:');
            console.log(rutaOrg);

            var compare = {
              ruta_org: rutaOrg.pointsurl,
              ruta2: tracking_data,
              dist_org: rutaOrg.distance,
              dist_ruta2: total_km_rounded
            };

            console.log('El compare')
            console.log(compare);


            $http.post(base_url_local + '/tracks/compare/isSame',compare).success(function(response){
              console.log('ENVIO Y COMPRUEBO');

              if(response == true){
                console.log('MATCH OK');

                trackSt = {
                  title: track_id,
                  username: userLogged.username,
                  data: tracking_data,
                  avg_speed: avg_speed_rounded,
                  distance: total_km_rounded,
                  time: total_time_s,
                  id_comun: rutaOrg.id_comun
                };

                window.localStorage.setItem('trackInfo', JSON.stringify(trackSt));
                $state.go('trackingManager',{type:'near',originalID:rutaOrg._id});


              }else{

                trackSt = {
                  title: track_id,
                  username: userLogged.username,
                  data: tracking_data,
                  avg_speed: avg_speed_rounded,
                  distance: total_km_rounded,
                  time: total_time_s

                };

                var confirmPopup = $ionicPopup.confirm({
                  title: 'Tracks are quite different!',
                  template: 'Press OK and the track will be saved as a new route'
                });

                confirmPopup.then(function(res) {
                  if(res) {
                    window.localStorage.setItem('trackInfo', JSON.stringify(trackSt));
                    $state.go('trackingManager');

                  } else {
                    $state.go('tab.dash');
                  }
                });

              }

            });


          }else {

            trackSt = {
              title: track_id,
              username: userLogged.username,
              data: tracking_data,
              avg_speed: avg_speed_rounded,
              distance: total_km_rounded,
              time: total_time_s

            };
            window.localStorage.setItem('trackInfo', JSON.stringify(trackSt));
            $state.go('trackingManager');

          }

         // window.localStorage.setItem('trackInfo', JSON.stringify(trackSt));

          //Me
          /*
          if($stateParams.type=='near'){
            console.log('entro en tipo near')

              $state.go('trackingManager',{type:'near',id:$stateParams.id});

          }else{
            $state.go('trackingManager');
          }*/

        }

      }

  })


  $scope.send = function() {

    var track ={
      title: track_id,
      username: userLogged.username,
      data: tracking_data,
      avg_speed: avg_speed_rounded,
      distance: total_km_rounded,
      time: total_time_s
    };
    console.log(track);

    $http.post(base_url_local + '/addtrack', track).then(function (response) {

        console.log('ENVIADO');
        $scope.res=response;
        $ionicPopup.alert({
          title: 'EXITO!',
          template: 'Ruta guardada!'
        });
      $state.go('tab.dash');
      },
      function(error){
        alert("ERROR");
        $ionicPopup.alert({
          title: 'ERROR!',
          template: 'Vuelve a intentarlo'
        });
      })
  }

  $scope.volver = function() {
    console.log("ENTRO EN LA FUUNCION DE CANCELAR");
    $scope.distancia = '';
    $scope.velocidad = '';
    $scope.tiempo = '';
    $state.go('tab.dash');
  }

}])

.controller('TrackManagerCtrl',function($scope,$http,$state,$ionicPopup,$ionicLoading,$stateParams){



  //MAP
  var info = JSON.parse(window.localStorage.getItem('trackInfo'));
  console.log(info);
  console.log(info.data[1].latitude);
  console.log(info.avg_speed);
  $scope.avgspeed = info.avg_speed;
  var time = info.time;
  console.log(time);
  $scope.distance=info.distance;

  var final_time_m = Math.floor(time / 60);
  var final_time_s = Math.floor(time - (final_time_m * 60));
  $scope.timeMS =final_time_m+' m '+final_time_s+' s';



  var map = new google.maps.Map(document.getElementById("map"),
    {
      zoom: 17,
      center: new google.maps.LatLng(info.data[1].latitude,info.data[1].longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP

    });

  var route = [];
  for (var i = 0; i < info.data.length; i++){
    console.log(info.data[i].latitude);
    route[i] = new google.maps.LatLng(info.data[i].latitude,info.data[i].longitude);
  }
  var path = new google.maps.Polyline(
    {
      path: route,
      strokeColor: "#FF0000",
      strokeOpacity: 0.7,
      strokeWeight: 3
    });
  path.setMap(map);

  $http.get(base_url_local + '/track/' + $stateParams.originalID).success(function (response) {

      $http.get(response.track_pedido.pointsurl).success(function (data) {

        var route2 = [];
        for (var i = 0; i < data.length; i++){
          console.log(data[i].latitude);
          route2[i] = new google.maps.LatLng(data[i].latitude,data[i].longitude);
        }
        var path2 = new google.maps.Polyline(
          {
            path: route2,
            strokeColor: "#5882FA",
            strokeOpacity: 0.7,
            strokeWeight: 3
          });

        path2.setMap(map);


      });


  });



  var marker=new google.maps.Marker({
    position:new google.maps.LatLng(info.data[0].latitude,info.data[0].longitude),
    label: 'START'
  });

  marker.setMap(map);

  var icon = {
    url: base_url_local+"/img/flag2.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
  };
  var marker2=new google.maps.Marker({
    position:new google.maps.LatLng(info.data[info.data.length-1].latitude,info.data[info.data.length-1].longitude),
    icon: icon
  });

  marker2.setMap(map);

  $scope.cancel= function() {

    //FUNCTIONS
    var confirmPopup = $ionicPopup.confirm({
      title: 'Cancel',
      template: 'Discard track?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.avgspeed ='';
        $scope.distance='';
        $scope.timeMS ='';
        localStorage.removeItem('trackInfo');

        $state.go('tab.dash');
      } else {
        $state.go('trackingManager');
      }
    });



  }

  $scope.saveTrack = function() {

    var track = JSON.parse(window.localStorage.getItem('trackInfo'));
    console.log(track);
    $http.post(base_url_local+ '/addtrack', track).then(function (response) {
        console.log('ENVIADO');
        $scope.res=response;
        $scope.avgspeed ='';
        $scope.distance='';
        $scope.timeMS ='';
        localStorage.removeItem('trackInfo');
        $ionicPopup.alert({
          title: 'NICE!',
          template: 'Track saved'
        });
        $state.go('tab.dash');
      },
      function(error){
        alert("ERROR");
        $ionicPopup.alert({
          title: 'ERROR!',
          template: 'Try again'
        });
      })
  }


})

.controller('TrackDetailCtrl', function($scope,$state,$stateParams,$http,$ionicHistory,$ionicLoading,$timeout,$ionicModal) {



  $ionicModal.fromTemplateUrl('templates/modalimg.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.profile = function(username){
    $state.go('profile',{username:username});
  }


  $scope.onHold = function(url,name,time,created,speed,distance,pos){

    var data = [];
    $http.get(url).success(function (datos) {

      console.log('URL: ' + url)

      console.log('Entro en el get');
      for (var i = 0; i < datos.length; i++) {
        if (i == 0) data.path = datos[i].latitude + "," + datos[i].longitude;
        else data.path += "|" + datos[i].latitude + "," + datos[i].longitude;
      }

      data.center = datos[1].latitude + "," + datos[1].longitude;
      var marker1 = datos[0].latitude + "," + datos[0].longitude;
      var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;

      $scope.modalimage="http://maps.googleapis.com/maps/api/staticmap?center=" + data.center+"&zoom=17&size=425x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data.path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
      console.log('Image: '+$scope.modalimage);
    });

    $scope.modalname = name;
    $scope.modalspeed = speed;
    $scope.modalcreated = created;
    $scope.modaldistance = distance;
    $scope.modaltime = time;
    $scope.modalpos = pos;
    console.log('Holding...');
    $scope.modal.show();
  };
  $scope.onRelease = function(){
    console.log('Releasing...');
    $scope.modal.hide();
  };



  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 1000);

  };




  $scope.loading();

  $scope.type = $stateParams.type;

  var userLogged = JSON.parse(localStorage.getItem('userLogged'));

  $scope.goback= function(){
    $ionicHistory.goBack();
  };

  console.log('El ID: '+$stateParams.id);


  $http.get(base_url_local + '/track/' + $stateParams.id).success(function (response) {

    $scope.original = response.track_pedido;

    var final_time_m = Math.floor(response.track_pedido.time / 60);
    var final_time_s = Math.floor(response.track_pedido.time - (final_time_m * 60));
    response.track_pedido.time = final_time_m+' min '+final_time_s+' s';

    if(response.track_pedido.distance<1) response.track_pedido.distance=response.track_pedido.distance * 1000 + ' m';
    else response.track_pedido.distance=response.track_pedido.distance + ' Km';

    if (response.track_pedido.avg_speed>0)response.track_pedido.avg_speed= Math.floor(60/(response.track_pedido.avg_speed)).toFixed(2);

    $http.get(response.track_pedido.pointsurl).success(function(data) {
      var map = new google.maps.Map(document.getElementById("map"),
        {
          zoom: 17,
          center: new google.maps.LatLng(data[1].latitude,data[1].longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });


      var route = [];
      for (var i = 0; i < data.length; i++){
        route[i] = new google.maps.LatLng(data[i].latitude,data[i].longitude);
      }
      var path = new google.maps.Polyline(
        {
          path: route,
          strokeColor: "#FF0000",
          strokeOpacity: 0.7,
          strokeWeight: 3
        });
      path.setMap(map);

      var marker=new google.maps.Marker({
        position:new google.maps.LatLng(data[0].latitude,data[0].longitude),
        label: 'START'
      });

      marker.setMap(map);

      var icon = {
        url: "img/flag2.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      var marker2=new google.maps.Marker({
        position:new google.maps.LatLng(data[data.length-1].latitude,data[data.length-1].longitude),
        icon: icon
      });

      marker2.setMap(map);


      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+data[1].latitude+","+data[1].longitude+"&&sensor=true";
      //var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + datos[0].latitude + "," + datos[1].longitude + "&&sensor=true";
      console.log(url);
      $http.get(url).success(function (response) {
        console.log(response);
        var address= response.results[0].formatted_address.split(',');
        $scope.addressTop = address[2] + ',' +address[3];
        $scope.addressList = address[0] + ',' +address[1];
      });
    });

    $scope.track = response.track_pedido;
    $http.get(base_url_local + '/users/user/' + $scope.track.username).success(function (response) {
      console.log(response);
      $scope.usuario = response[0];
    });


    console.log(response.ranking.length);
    response.ranking.sort(function(a, b) {
      var s = parseFloat(a.time) - parseFloat(b.time);
      console.log("EL A: " + s);
      return s;
    });
    for(var i=0; i<response.ranking.length; i++) {
      console.log("1 TIEMPO: "+response.ranking[i].time);
      var final_time_m = Math.floor(response.ranking[i].time / 60);
      var final_time_s = Math.floor(response.ranking[i].time - (final_time_m * 60));
      response.ranking[i].time = final_time_m + ' min ' + final_time_s + ' s';
      console.log("2 TIEMPO: "+ response.ranking[i].time);
    }

    response.ranking.sort(function(a, b) {
      var s = parseFloat(a.time) - parseFloat(b.time);
      console.log("EL A: " + s);
      return s;
    });

    $scope.ranking = response.ranking;

    $scope.position = 0;
    for(var pos=0; pos<response.ranking.length; pos++) {
      if(response.ranking[pos].username == userLogged.username){
        $scope.position = pos+1;
        break;
      }
    }

    console.log('Rank:');
    console.log($scope.ranking);
    console.log('Position:')
    console.log($scope.position);


  });

  $scope.toTracking = function(id){
    $http.get(base_url_local + '/track/' + id).success(function (response) {
      console.log('Lo que paso');
      console.log(response.track_pedido);
      $state.go('tracking',{type:'near',trackoriginal:JSON.stringify(response.track_pedido)});
    });

  };

})


.controller('RegisterFBCtrl',['$scope','$state','$http','$stateParams','$ionicPopup','$rootScope','SocketIoFactory', function($scope,$state,$http,$stateParams,$ionicPopup,$rootScope,socket) {


  $scope.userFB = JSON.parse($stateParams.userFB);

  $scope.registerFB = function(usernameeFB){

    if(!angular.isUndefined(usernameeFB)){

      var user = {
        username: usernameeFB,
        fullname:$scope.userFB.fullname,
        email: $scope.userFB.email,
        imgurl: $scope.userFB.imgurl,
        facebook_id: $scope.userFB.facebook_id

      };

      $http.post(base_url_local+'/user', user).success(function(response){
        console.log(user);
        console.log(response);
        localStorage.setItem('userLogged', JSON.stringify(response));
        $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
        socket.connect();
        console.log("socket.connect()");
        socket.on('connection', function(data){
          console.log(data);
          socket.emit('username',$rootScope.userLogged.username);
          socket.emit('notification',$rootScope.userLogged.username);
        });
        socket.on('listaUsers', function(data){
          console.log("LOS USUARIOS");
          console.log(data);
        });
        console.log("3");
        socket.on('new notification', function(data){
          socket.emit('notification',$rootScope.userLogged.username, function(data){
          } )
        });
        socket.on('notification', function(data){
          $rootScope.notlength=data.numeros;
          //$rootScope.notification=data.notifications;
          console.log(data);
        });
        socket.on('chat', function (data) {

          console.log("CHAT");
          $rootScope.$emit('myEvent', function (event, viewData) {
            console.log("EN EL BROADCAST");
          });
          // $state.go($state.currentState, {}, {reload:true});
          // $state.go($state.current, $state.$current.params, {reload: true});

        });

        $state.go('tab.dash');
      }).error(function (response) {

        $ionicPopup.alert({
          title: 'Error',
          template: 'Username already exists'
        });

      });

    }else {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Username uncomplete'
      });


    }



  };



  }])

.controller('LoginCtrl',['$scope', '$http', '$rootScope', 'SocketIoFactory', '$state', '$localStorage', 'ngFB','$ionicPopup', function($scope, $http, $rootScope, socket, $state, $localStorage, ngFB,$ionicPopup){

  $scope.redir = function() {
    $state.go('register');
  };

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
      $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
      socket.connect();
      console.log("socket.connect()");
      socket.on('connection', function(data){
        console.log(data);
        socket.emit('username',$rootScope.userLogged.username);
        socket.emit('notification',$rootScope.userLogged.username);
      });
      socket.on('listaUsers', function(data){
        console.log("LOS USUARIOS");
        console.log(data);
      });
      console.log("3");
      socket.on('new notification', function(data){
        socket.emit('notification',$rootScope.userLogged.username, function(data){
        } )
      });
      socket.on('notification', function(data){
        $rootScope.notlength=data.numeros;
        //$rootScope.notification=data.notifications;
        console.log(data);
      });
      socket.on('chat', function (data) {

        console.log("CHAT");
        $rootScope.$emit('myEvent', function (event, viewData) {
          console.log("EN EL BROADCAST");
        });
        // $state.go($state.currentState, {}, {reload:true});
        // $state.go($state.current, $state.$current.params, {reload: true});

      });


      $state.go('tab.dash');
    },
    function(error){
      $ionicPopup.alert({
        title: 'Error',
        template: 'incorrect username or password'
      });
    })
  };



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
              console.log("COJO EL USUSARIO DE FB");
              var user = {
                username: res.name,
                fullname:res.name,
                email: res.email,
                imgurl: 'http://graph.facebook.com/'+res.id +'/picture?width=270&height=270',
                facebook_id: res.id

              };
              console.log("BUSCO FB ID");
              $http.get(base_url_local+'/users/user/facebook/'+ user.facebook_id).success(function (response){

                if(response == ''){
                  //console.log("NO EXISTE POR LO QUE LE PIDO QUE PONGA USERNAME");
                  console.log("NO EXISTE POR LO QUE LO CREO");
                  $http.post(base_url_local+'/user', user).success(function(response){
                    console.log(user);
                    console.log(response);
                    localStorage.setItem('userLogged', JSON.stringify(response));
                    $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
                    socket.connect();
                    console.log("socket.connect()");
                    socket.on('connection', function(data){
                      console.log(data);
                      socket.emit('username',$rootScope.userLogged.username);
                      socket.emit('notification',$rootScope.userLogged.username);
                    });
                    socket.on('listaUsers', function(data){
                      console.log("LOS USUARIOS");
                      console.log(data);
                    });
                    console.log("3");
                    socket.on('new notification', function(data){
                      socket.emit('notification',$rootScope.userLogged.username, function(data){
                      } )
                    });
                    socket.on('notification', function(data){
                      $rootScope.notlength=data.numeros;
                      //$rootScope.notification=data.notifications;
                      console.log(data);
                    });
                    socket.on('chat', function (data) {

                      console.log("CHAT");
                      $rootScope.$emit('myEvent', function (event, viewData) {
                        console.log("EN EL BROADCAST");
                      });
                      // $state.go($state.currentState, {}, {reload:true});
                      // $state.go($state.current, $state.$current.params, {reload: true});

                    });
                    $state.go('tab.dash');
                  }).error(function (response) {

                    console.log("YA EXISTE ESTE USERNAME AL HACER EL POST");
                    $state.go('registerFB',{userFB:JSON.stringify(user)});

                  });
                  //$state.go('registerFB',{userFB:JSON.stringify(user)});


                }else {
                  console.log("YA EXISTE, PASO A DASH Y GUARDO SESION")
                  console.log(response);
                  localStorage.setItem('userLogged', JSON.stringify(response[0]));
                  $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
                  socket.connect();
                  console.log("socket.connect()");
                  socket.on('connection', function(data){
                    console.log(data);
                    socket.emit('username',$rootScope.userLogged.username);
                    socket.emit('notification',$rootScope.userLogged.username);
                  });
                  socket.on('listaUsers', function(data){
                    console.log("LOS USUARIOS");
                    console.log(data);
                  });
                  console.log("3");
                  socket.on('new notification', function(data){
                    socket.emit('notification',$rootScope.userLogged.username, function(data){
                    } )
                  });
                  socket.on('notification', function(data){
                    $rootScope.notlength=data.numeros;
                    //$rootScope.notification=data.notifications;
                    console.log(data);
                  });
                  socket.on('chat', function (data) {

                    console.log("CHAT");
                    $rootScope.$emit('myEvent', function (event, viewData) {
                      console.log("EN EL BROADCAST");
                    });
                    // $state.go($state.currentState, {}, {reload:true});
                    // $state.go($state.current, $state.$current.params, {reload: true});

                  });
                  $state.go('tab.dash');

                }

              }).error(function (data,err) {
                console.log("Estoy en el error")
                console.log(err);
                //$state.go('registerFB',{userFB:JSON.stringify(user)});
                //$state.go("app.example2", {object: JSON.stringify(obj)});
                alert('Facebook error request');
                  //$state.go('registerFB',{userFB:JSON.stringify(user)});

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





/*
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
              console.log("COJO EL USUSARIO DE FB");
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

*/
}])

.controller('RegisterCtrl',['$scope','$http','$state','$ionicPopup','$localStorage','$rootScope','SocketIoFactory',function($scope,$http,$state,$ionicPopup,$localStorage,$rootScope,socket){

  $rootScope.$ionicGoBack = function() {
    $state.go('login');
  };

  $scope.range_weight = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  $scope.range_height = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  $scope.range_age = function(start,end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };


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
        $rootScope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
        socket.connect();
        console.log("socket.connect()");
        socket.on('connection', function(data){
          console.log(data);
          socket.emit('username',$rootScope.userLogged.username);
          socket.emit('notification',$rootScope.userLogged.username);
        });
        socket.on('listaUsers', function(data){
          console.log("LOS USUARIOS");
          console.log(data);
        });
        console.log("3");
        socket.on('new notification', function(data){
          socket.emit('notification',$rootScope.userLogged.username, function(data){
          } )
        });
        socket.on('notification', function(data){
          $rootScope.notlength=data.numeros;
          //$rootScope.notification=data.notifications;
          console.log(data);
        });
        socket.on('chat', function (data) {

          console.log("CHAT");
          $rootScope.$emit('myEvent', function (event, viewData) {
            console.log("EN EL BROADCAST");
          });
          // $state.go($state.currentState, {}, {reload:true});
          // $state.go($state.current, $state.$current.params, {reload: true});

        });
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

}])

.controller('MessagesCtrl',['$scope','$http','$localStorage','$state','$stateParams','$rootScope','simpleObj', function($scope,$http,$localStorage,$state,$stateParams,$rootScope, simpleObj) {


  $scope.toSearch= function(){
    $state.go('search');
  };


  $scope.toTrack = function(){
    $state.go('selecter');
    //$state.go('tracking');
  };

  $scope.detail=function(username){
    $state.go('tab.message-detail',{name:username});
  };

  $scope.hello = function() {
    console.log(simpleObj);
    console.log();
  }

  var userLogged = JSON.parse(localStorage.getItem('userLogged'));
  console.log(userLogged);
  console.log(userLogged.username);
  $scope.users="";
  $http.get(base_url_local+ '/messages/'+userLogged.username).success(function (response) {
    console.log(response);
    $scope.users = response;
    $scope.user="";

  });



}])

.controller('FriendsCtrl', ['$scope', '$http', '$state', '$ionicPopup', '$stateParams', '$ionicHistory', '$timeout', '$ionicLoading', 'SocketIoFactory','$q', function($scope, $http, $state, $ionicPopup, $stateParams, $ionicHistory, $timeout, $ionicLoading, socket,$q){

  var userLogged = JSON.parse(localStorage.getItem('userLogged'));
  $scope.userLogged = userLogged;

  var main = function(){
    var promises = [];
    $scope.buttons = [];

    console.log('GETTING FOLLOWING de '+$stateParams.username);

    $http.get(base_url_local + '/friends/' + $stateParams.username).success(function (data,callback) {
      console.log("primer GET");
      console.log(data);
      $scope.friends = data;

      angular.forEach(data, function(user, key) {
        console.log("EN EL FOREACH");

        var deffered  = $q.defer();

        $http.get(base_url_local+ '/friends/' + userLogged.username + "/" + user.friend.username).success(function (response) {
          deffered.resolve(response);

        });

        promises.push(deffered.promise);

        console.log('Buttons:');
        console.log($scope.buttons);

      });
      console.log("PROMISES");
      console.log($q.all(promises));
      $q.all(promises).then(function(results){
        console.log("ALL");
        console.log(results);
        for(i=0;i<results.length;i++){
          var obj = results[i];
          //console.log($scope.buttons.length);
          $scope.buttons.push(obj);
          //return response;
        }
      });


      if($scope.friends == '')
        $scope.noFollowing = true;
      else $scope.noFollowing = false;
    }).error(function (data, status) {
      alert('get data error!');
    });


    console.log('finish');

  };

  main();

  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 600);

  };


  $scope.goback= function(){
    $ionicHistory.goBack();
  };

  $scope.follow = function (namee) {
    console.log("Dentro de addFriend");
    var amigos = new Object();
    amigos.username = userLogged.username;
    console.log(userLogged.username);
    amigos.friend = namee;
    console.log(namee);
    console.log("Lo que envio " + amigos);

    $http.post(base_url_local+'/addfriend', amigos).success(function() {
      socket.emit('follow', amigos.friend);
      main();
    });
  };

  $scope.unfollow = function (name) {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Unfollow '+ name + ' ?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.loading();
        $http.delete(base_url_local+'/friend/' + $scope.userLogged.username + "/" + name).success(function () {
          main();
        });
      } else {
        console.log('You are not sure');
      }
    });

  };



  $scope.isFriend = function (isfriend) {

    console.log(userLogged.username + isfriend);
    $http.get(base_url_local+ '/friends/' + userLogged.username + "/" + isfriend).success(function (response) {
      console.log(response);
      var obj = { data: response };
      $scope.buttons.push(obj);
      //return response;
    });

    console.log($scope.buttons);

  };


  var loadButtons = function(data){
    $scope.buttons = [];
    console.log(data);
    angular.forEach(data, function(user, key) {
      $scope.isFriend(user.friend.username);

    });

  };

/*
  var main = function(){

    $scope.buttons = [];

    if($stateParams.type == 'following'){


      var refresh = function() {
        $scope.buttons = [];
        $http.get(base_url_local + '/friends/' + $stateParams.username).success(function (data) {
          console.log(data);
          $scope.friends = data;
          loadButtons(data);
          if($scope.friends == '')
            $scope.noAct = true;
          else $scope.noAct = false;
        }).error(function (data, status) {
          alert('get data error!');
        });


      }
      refresh();


    }


    if($stateParams.type == 'followers'){

      var refresh2 = function() {
        $scope.buttons = [];
        $http.get(base_url_local + '/friends/friend/' + $stateParams.username+'/followers').success(function (data) {
          console.log(data);
          $scope.friends = data;
          loadButtons(data);
          if($scope.friends == '')
            $scope.noAct= true;
          else $scope.noAct = false;
        }).error(function (data, status) {
          alert('get data error!');
        });


      }
      refresh2();

    }

  };

  main();*/


  $scope.profile = function(username){
    $state.go('profile',{username:username});
  }

  }])

.controller('FollowersCtrl',function($scope,$http,$state,$ionicPopup,$stateParams,$ionicHistory,$timeout,$ionicLoading,$q,SocketIoFactory){

    var userLogged = JSON.parse(localStorage.getItem('userLogged'));
    $scope.userLogged = userLogged;

    $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 600);

  };
    $scope.goback= function(){
      $ionicHistory.goBack();
    };



  var main = function(){
    var promises = [];
    $scope.buttons = [];

    console.log('GETTING FOLLOWING de '+$stateParams.username);

    $http.get(base_url_local + '/friends/friend/' + $stateParams.username+'/followers').success(function (data) {
      console.log("primer GET");
      console.log(data);
      $scope.friends = data;

      angular.forEach(data, function(user) {
        console.log("EN EL FOREACH");

        var deffered  = $q.defer();

        $http.get(base_url_local+ '/friends/' + userLogged.username + "/" + user.username).success(function (response) {
          deffered.resolve(response);

        });

        promises.push(deffered.promise);

        console.log('Buttons:');
        console.log($scope.buttons);

      });
      console.log("PROMISES");
      console.log($q.all(promises));
      $q.all(promises).then(function(results){
        console.log("ALL");
        console.log(results);
        for(i=0;i<results.length;i++){
          var obj = results[i];
          $scope.buttons.push(obj);
        }
      });

      if($scope.friends == '')
        $scope.noFollowing = true;
      else $scope.noFollowing = false;
    }).error(function (data) {
      alert('get data error!');
    });

    console.log('finish');

  };

  main();




    $scope.follow = function (namee) {
      console.log("Dentro de addFriend");
      var amigos = new Object();
      amigos.username = userLogged.username;
      console.log(userLogged.username);
      amigos.friend = namee;
      console.log(namee);
      console.log("Lo que envio " + amigos)
      $http.post(base_url_local+'/addfriend', amigos).success(function(response) {
        main();
        SocketIoFactory.emit('follow', amigos.friend);

      });
    }

    $scope.unfollow = function (name) {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Unfollow '+ name + ' ?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $scope.loading();
          $http.delete(base_url_local+'/friend/' + $scope.userLogged.username + "/" + name).success(function () {
            main();
          });
        } else {
          console.log('You are not sure');
        }
      });

    };

    /*

    $scope.isFriend = function (isfriend) {

      console.log(userLogged.username + isfriend);
      $http.get(base_url_local+ '/friends/' + userLogged.username + "/" + isfriend).success(function (response) {
        console.log(response);
        var obj = { data: response };
        $scope.buttons.push(obj);
        //return response;
      });

      console.log($scope.buttons);

    };


    var loadButtons = function(data){
      $scope.buttons = [];
      console.log(data);

      console.log('for each followers');
      angular.forEach(data, function(user) {
        $scope.isFriend(user.username);

      });

    }

    var main = function(){

      $scope.buttons = [];
        console.log('followers');

        var refresh = function() {
          $scope.buttons = [];
          $http.get(base_url_local + '/friends/friend/' + $stateParams.username+'/followers').success(function (data) {
            console.log(data);
            $scope.friends = data;
            loadButtons(data);
            if($scope.friends == '')
              $scope.noAct= true;
            else $scope.noAct = false;
          }).error(function (data, status) {
            alert('get data error!');
          });



      }

        refresh();
    };

    main();*/



    $scope.profile = function(username){
      $state.go('profile',{username:username});
    }
  })


.controller('MessageDetailCtrl',['$scope','$http','$stateParams','$localStorage','$ionicScrollDelegate', 'SocketIoFactory','$state','$ionicHistory','$ionicPlatform','$rootScope', function($scope, $http, $stateParams, $localStorage, $ionicScrollDelegate, socket,$state,$ionicHistory,$ionicPlatform,$rootScope) {


  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
/*
  $scope.back = function(){
    $state.go('tab.account');
  };
*/

  $rootScope.$ionicGoBack = function() {
    $state.go('tab.messages');
  };


  $scope.userC = $stateParams.name;
  console.log('Conv con: '+$scope.userC)
  $scope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
  //$scope.logged = userLogged;

  var load = function(){

    $http.get(base_url_local+ '/messages/' + $scope.userLogged.username +'/' + $stateParams.name).success(function (response) {
      console.log("Messages received");
      console.log(response);
      $http.get(base_url_local+ '/users/user/' + $stateParams.name).success(function (response) {

        console.log("Entro");
        console.log(response[0].username);
        $scope.conversationWith = response[0];

      });
      $scope.messages = response;


      $ionicScrollDelegate.scrollBottom();

    });

  };

  load();


  $rootScope.$on('myEvent', function (event, viewData) {
    load();
  });





  $scope.sendMessage = function(receiver) {
    console.log("Before sending")
    console.log($scope.message);

    $scope.message.sender = $scope.userLogged.username;
    $scope.message.receiver = receiver;
    console.log('Mensaje:' +$scope.message);
    console.log('Sender:' +$scope.message.sender);
    console.log('Receiver:' +$scope.message.receiver);
    console.log('Text:' +$scope.message.text);

    $http.post(base_url_local+'/addmessage', $scope.message).success(function(response) {

      console.log($scope.message);
      console.log("Response");
      console.log(response);
      $scope.message="";
      socket.emit('message', receiver);

      load();
    });
  };



  $scope.profile = function (name) {
    $location.path('/profile/' + name);
  };



}])

.controller('TestCtrl',['$scope','$http','$stateParams', function($scope,$http){
console.log("estoy dentro");
  getUsersInConversation = function() {
    $http.get(base_url_local+ '/users/user/'+ stateParams.name).success(function (response) {
      console.log(response);
      $scope.user = response;
    });
  }
  getUsersInConversation();
}])

.controller('SelecterCtrl', function($scope,$state,$ionicHistory,$ionicLoading,$timeout){

  $scope.numberange = 30;

  $scope.toNearRoutes = function(rangeNear){
    $state.go('nearoutes',{range:rangeNear});
  };


  $scope.goback = function(){

    $state.go('tab.dash');

  };
  $scope.toTrack = function(){
    $state.go('tracking');
  }

  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 2000);

  }




})

.controller('NearRoutesCtrl', function($scope,$http,$cordovaGeolocation,$ionicPopup,$state,$ionicLoading,$timeout,$stateParams,$rootScope,$q){

  $scope.range = $stateParams.range;

  $rootScope.$ionicGoBack = function() {
    $state.go('selecter');
  };

  var loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 2000);

  }

  loading();


  var getPosition = function(){


  var posOptions = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
console.log('Range: '+$stateParams.range);
    var cord ={
      latitude : position.coords.latitude,
      longitude: position.coords.longitude,
      range: $stateParams.range
    };
    console.log(cord);

    var main = function(){
      var promises=[];
      console.log("estoy en el main");
      $http.post(base_url_local +'/test', cord).success(function(data){
        console.log("PRIMER GET");

        console.log(data);
        if(data=="") {
          console.log("DENTRO DEL NO FOLLOWING");
          $scope.noFollowing = true;
        }
        angular.forEach(data,function(d){
          //console.log("EN EL FOREACH");
          //console.log(d.pointsurl);
          var deffered  = $q.defer();
          $http.get(d.pointsurl).success(function(datos){
            //console.log("GET");
            deffered.resolve(datos);
            console.log(deffered.promise);

          });
          //console.log("PUSH");
          promises.push(deffered.promise);
          console.log(promises);
        });
        console.log("PROMISES");
        console.log($q.all(promises));
        $q.all(promises).then(function(results){
          console.log("ALL");
          console.log(results);
          console.log(data);
          var int=0;
          for (var i = 0; i < data.length; i++) {

            var final_time_m = Math.floor(data[i].time / 60);
            var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
            data[i].time =final_time_m+' min '+final_time_s+' s';

            if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
            else data[i].distance=data[i].distance + ' Km';

            if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

            for (var a = 0; a < results[i].length; a++) {
              if (a == 0) data[int].path = results[i][a].latitude + "," + results[i][a].longitude;
              else data[int].path += "|" + results[i][a].latitude + "," + results[i][a].longitude;
            }
            data[int].center = results[i][1].latitude + "," + results[i][1].longitude;
            var marker1 = results[i][0].latitude + "," + results[i][0].longitude;
            var marker2 = results[i][results[i].length -1].latitude + "," + results[i][results[i].length -1].longitude;

            //strokeColor: "#FF0000",
            //strokeOpacity: 0.7,
            //strokeWeight: 3
            data[int].img="http://maps.googleapis.com/maps/api/staticmap?center="+data[int].center+"&zoom=17scale=1&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
            //zoom:17
            //mapTypeId: google.maps.MapTypeId.ROADMAP
            int++;


          }
          console.log("FINSIH");
          $scope.routes = data;
          console.log(data);
        });
      });


    };
    main();


/*
    $http.post(base_url_local+'/test', cord).success(function (data) {
      console.log('Near routes: ')
        console.log(data);
      //AQUI IF Y ELSE
          var int=0;
          for (var i = 0; i < data.length; i++) {
            var final_time_m = Math.floor(data[i].time / 60);
            var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
            data[i].time =final_time_m+' min '+final_time_s+' s';

            if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
            else data[i].distance=data[i].distance + ' Km';

            if (data[i].avg_speed>0) (data[i].avg_speed= 1/data[i].avg_speed)*60;

            $http.get(data[i].pointsurl).success(function (datos) {
              for (var i = 0; i < datos.length; i++) {
                if (i == 0) data[int].path = datos[i].latitude + "," + datos[i].longitude;
                else data[int].path += "|" + datos[i].latitude + "," + datos[i].longitude;
              }
              data[int].center = datos[1].latitude + "," + datos[1].longitude;
              var marker1 = datos[0].latitude + "," + datos[0].longitude;
              var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;


              data[int].img="http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center+"&zoom=17&size=425x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
              int++;
            });
          }
          console.log(data);
          $scope.routes = data;
          if(data==''){
            $scope.noTracks=true;
          }


      },
      function(error){
        alert("ERROR");
      })*/

    });



  };

  getPosition();

  $scope.trackdetail= function(trackid){
    $state.go('trackdetail',{type:'near',id:trackid});
  }

  })


.controller('TabCtrl', function($scope,$http,$localStorage,$ionicPopup,$state,$ionicLoading,$timeout,$rootScope){
  var userLogged = JSON.parse(localStorage.getItem('userLogged'));

 /* $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      console.log("STATE CHANGE START");
    });*/



  $scope.loading2 = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 900);

  }

  $scope.activity = function() {

    $state.go('tab.dash');
  }

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
     $state.go('tab.messages',{},{reload:true});
  };

  $scope.notifica = function() {
    $http.get(base_url_local + '/notifications/user/' +userLogged.username).success(function (response) {
      console.log(response);
      $scope.notifications = response;
    });
    if ($rootScope.notlength != 0) {
      $http.put(base_url_local + '/notifications/saw/' + userLogged.username);
      $rootScope.notlength = 0;
    }
    $state.go('tab.notifications',{},{reload:true});


  };




});
