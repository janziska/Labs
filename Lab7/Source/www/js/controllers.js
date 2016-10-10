angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $window) {
    $scope.data = {};
    // Login function
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password, localStorage.getItem('user.name'), localStorage.getItem('user.password')).success(function(data) {
           // It worked head to the homepage
            $state.go('home');
        }).error(function(data) {
            // Wrong stuff, try again
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }  

    // Go to the registration page
   $scope.goRegister = function() {
       
            $state.go('register');
            var alertPopup = $ionicPopup.alert({
                title: 'Leaving Page',
                template: 'Going to Register'
            });
    }  
})

// Register a user
.controller('RegisterCtrl', function($scope, $state) {

    $scope.signupEmail = function(name, username, email, password){
  
    // Make sure they can use local storage before taking the data
    if (typeof(Storage) !== "undefined") {

      //Create a new user on Parse
      localStorage.setItem('user.name', name);
      localStorage.setItem('user.username',username);
      localStorage.setItem('user.password', password);
      localStorage.setItem('user.email', email);
  } else {
    // No local storage :()
    var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'No Local Storage on Browser'
              });
  }
        // Go to the login page
      $state.go('login'); 
  }

  
})

// Home page lookup
.controller('HomeCtrl', function($scope, $http, $ionicPopup, $state, $window, $cordovaGeolocation) {
    // Geo location, started with code from https://www.tutorialspoint.com/ionic/ionic_geolocation.htm
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    
  $cordovaGeolocation
  .getCurrentPosition(posOptions)
	
   .then(function (position) {
     // var lat  = position.coords.latitude;
     // var long = position.coords.longitude;
      
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var request = {
        latLng: latlng
      };
      geocoder.geocode(request, function(data, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (data[0] != null) {
           $scope.city =  data[0].formatted_address;
          } else {
            alert("No address available");
          }
        }
      })
   }, function(err) {
      console.log(err);
   });

   //var watchOptions = {timeout : 3000, enableHighAccuracy: false};
   //var watch = $cordovaGeolocation.watchPosition(watchOptions);
	
   watch.then(
      null,
		
      function(err) {
         console.log(err);
      },
		
      function(position) {
         var lat  = position.coords.latitude;
         var long = position.coords.longitude;
         alert(lat + '' + long);
         
      }
   );

    watch.clearWatch();




    $scope.myFunction = function(source, city){
        $scope.venueList = new Array();
        // translate the text
        $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords?apikey=6374c076c0afdefeb93b382ecf5610fb71710307&outputMode=json&text="
        + source)
            .then(function(response){
                // Store translation
                $scope.keyWord = response.data.keywords[0].text;
                var keyWord = response.data.keywords[0].text;
                $http.get("https://api.foursquare.com/v2/venues/search?client_id=EMPP4S253KDVUU5KJHWUCOEANVTQJP1O11SOKYMZW2TY2Y2A" +
                "&client_secret=4ZDMZR2EVRZDAV13JBYLT4WNRPO4GBEDOFXTOZ0UZTH42AFA&v=20160215&limit=5&near=" + city + "&query=" + keyWord)
                    .then(function(response2){
                    // Borrowed this from Tutorial 3
                        $scope.title = "Fun Places You May Like";
                        for (var i = 0; i < response2.data.response.venues.length; i++) {
                        $scope.venueList[i] = {
                        "name": response2.data.response.venues[i].name,
                        "id": response2.data.response.venues[i].id,
                        "location": response2.data.response.venues[i].location.address
                        };
                     }

                        })
                      

               });
            }
});
