//var base_url_local="http://147.83.7.157:8080";

var base_url_local="http://192.168.1.10:8080";


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

      searchUsers : searchUsers

    }
  })

.controller('DashCtrl', function($scope,$state) {
  $scope.toTrack = function(){
    $state.go('tracking');
  }

  $scope.toSearch= function(){
    $state.go('search');
  }


})

.controller('ProfileCtrl', function($scope,$http,$state,$ionicPopup,$ionicActionSheet,$stateParams,$anchorScroll,$location,$ionicLoading,$timeout,$ionicScrollDelegate,$ionicHistory) {

  $scope.userLogged = JSON.parse(localStorage.getItem('userLogged'));
  $scope.showActionSheet = function() {// Show the action sheet




    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'We' }
        , { text: 'Are' }
        , { text: 'Working' }
        , { text: "On this. Flivess" }
      ],
      cancelText: '<span class="color-white">Cancel</span>',
      cssClass: 'tinder-actionsheet',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });};

  $scope.toFollowing = function(user){
    $state.go('friends',{type:'following',username:user});
  };

  $scope.toFollowers = function(user){
    $state.go('followers',{username:user});
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

  var getTracks = function(){
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
    }
  };

  getTracks();


})

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

      UsersDataService.searchUsers($scope.data.search).then(
        function(matches) {
          $scope.data.users = matches;
        }
      )
    }

}])

.controller('EditProfileCtrl', ['$scope','$ionicHistory','$state','$http','$ionicLoading','$timeout','$rootScope', function($scope,$ionicHistory,$state,$http) {



  $scope.userLogged = JSON.parse(localStorage.getItem('userLogged'));

  $scope.goback= function(){
      $ionicHistory.goBack();
    }

  $http.get(base_url_local + '/user/' + $scope.userLogged._id).success(function(response){
    $scope.user = response;

  });

  $scope.updateUser = function() {

    $http.put(base_url_local +'/user/' + $scope.userLogged._id, $scope.user).success(function (response) {
      $ionicHistory.goBack();
    })

  };



  }])

.controller('AccountCtrl', function($scope,$ionicPopup,$state,$ionicLoading,$timeout) {

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
    $state.go('tracking');
  }

  $scope.logout = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Exit Flivess',
      template: 'Are you sure?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        localStorage.clear();
        console.log(localStorage.getItem('userLogged'));
        $state.go('login');
      } else {
        $state.go('tab.account');
      }
    });
  }


  })

.controller('TracksUserCtrl', function($http,$scope,$ionicPopup,$state,$stateParams,$ionicHistory) {

  var getTracks = function(){
    $scope.routes='';


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

  getTracks();

  $scope.goback= function(){
    $ionicHistory.goBack();
  }


  })

.controller('TrackingCtrl',['$scope','$http','$cordovaGeolocation','$ionicPlatform','$state','$ionicPopup','$ionicLoading','$timeout', function($scope,$http,$cordovaGeolocation,$ionicPlatform,$state,$ionicPopup,$ionicLoading,$timeout) {
  console.log("EN EL TRACKINGCTRL");
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
    desiredAccuracy: 0, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
    distanceFilter: 1, // (Meters) How far you must move from the last point to trigger a location update
    debug: true, // <-- Enable to show visual indications when you receive a background location update
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
            template: 'Are you lazy today? there are not points tracked!'
          });
          $state.go('tab.dash');

        }
        else {


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

          //Me
          var trackSt = {
            title: track_id,
            username: userLogged.username,
            data: tracking_data,
            avg_speed: avg_speed_rounded,
            distance: total_km_rounded,
            time: total_time_s
          };
          window.localStorage.setItem('trackInfo', JSON.stringify(trackSt));


          var hide = function () {
            $ionicLoading.hide();
          };
          hide();
          //Me
          $state.go('trackingManager');
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

.controller('TrackManagerCtrl',function($scope,$http,$state,$ionicPopup,$ionicLoading){



  //MAP
  var info = JSON.parse(window.localStorage.getItem('trackInfo'));
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
      mapTypeId: google.maps.MapTypeId.ROADMAP,

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
/*
  var hide = function(){
    $ionicLoading.hide();
  };
  hide();
*/
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
  $scope.toSearch= function(){
    $state.go('search');
  }


  $scope.toTrack = function(){
    $state.go('tracking');
  }

  $scope.detail=function(username){
    $state.go('tab.message-detail',{name:username});
  }

  $scope.hello = function() {
    console.log(simpleObj);
    console.log();
  }









}])

.controller('FriendsCtrl',function($scope,$http,$state,$ionicPopup,$stateParams,$ionicHistory,$timeout,$ionicLoading){

  var userLogged = JSON.parse(localStorage.getItem('userLogged'));
  $scope.userLogged = userLogged;

  $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 600);

  }


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
    console.log("Lo que envio " + amigos)
    $http.post(base_url_local+'/addfriend', amigos).success(function(response) {
      main();

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

  $scope.buttons = [];

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

  }

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

  main();




  $scope.profile = function(username){
    $state.go('profile',{username:username});
  }

  })

.controller('FollowersCtrl',function($scope,$http,$state,$ionicPopup,$stateParams,$ionicHistory,$timeout,$ionicLoading){

    var userLogged = JSON.parse(localStorage.getItem('userLogged'));
    $scope.userLogged = userLogged;

    $scope.loading = function(){
    $ionicLoading.show();

    $timeout(function () {
      $ionicLoading.hide();
    }, 600);

  }
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
      console.log("Lo que envio " + amigos)
      $http.post(base_url_local+'/addfriend', amigos).success(function(response) {
        main();

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

    $scope.buttons = [];

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

    main();



    $scope.profile = function(username){
      $state.go('profile',{username:username});
    }
  })

.controller('MessageDetailCtrl',['$scope','$http','$stateParams','$localStorage','$ionicScrollDelegate', function($scope,$http,$stateParams,$localStorage,$ionicScrollDelegate) {

  $scope.userC = $stateParams.name;
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

      load()
    });
  };



  $scope.profile = function (name) {
    $location.path('/profile/' + name);
  }


  /*
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
*/


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

.controller('TabCtrl', function($scope,$http,$localStorage,$ionicPopup,$state,$ionicLoading,$timeout){

  $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      console.log("STATE CHANGE START");
    });

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
     $state.go('tab.messages');
  }




});
