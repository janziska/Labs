/**
 * Created by janziska on 9/9/2016.
 */
'use strict';

// Uclassify Api key for mood
// read yyckHiiOgGhQ
// Write t0gVcFMv7JGd

// Google client id - 872368336329-smi8nn873rvhopil30abkemqn1lukuh9.apps.googleusercontent.com
// client secret - VJL00eeSj7buen7p6hyuWm1G
// https://www.googleapis.com/language/translate/v2?key=YOUR_API_KEY&q=hello%20world&source=en&target=de
// simple google api - AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM




// On page load, initialize Google SSO Info
function onLoad() {
    gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init();

        // If not logged in, redirect to login
        auth2.then(function () {
            if (!auth2.isSignedIn.get()) {
                window.location.href="login.html";
            }
        });
    });
}
// Sign out function
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href="login.html";
    });


}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}


function onSuccess(googleUser) {
    console.log('Signed in as: ' + googleUser.getBasicProfile().getName());
    window.location.href="translate.html";
}
angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope, $http) {



        $scope.myFunction = function(){

            var sourceText = document.getElementById("sourceText").value;
            var sourceLanguage = document.getElementById("from").value;
            var targetLanguage = document.getElementById("to").value;

           $http.get("https://www.googleapis.com/language/translate/" + "v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM&source="
               + sourceLanguage + "&target=" + targetLanguage + "&q=" + sourceText)
               .then(function(response){

                   $scope.transText = "Translation: " + response.data.data.translations[0].translatedText;
                  var transText =  "Translation: " + response.data.data.translations[0].translatedText;


                  $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?" +
                      "apikey=6374c076c0afdefeb93b382ecf5610fb71710307&outputMode=json&text=" + transText)
                      .then(function(response2){
                            console.log(transText);

                          // Angular broke Google Sign Out so I had to stop using it
                          $scope.score =  "Score: " + parseFloat(response2.data.docSentiment.score*100).toFixed(0);
                          $scope.type =   "Type:  " +  response2.data.docSentiment.type;
                          // Set width pasted on score
                          var width = response2.data.docSentiment.score*200;
                          var type = response2.data.docSentiment.type;


                          // thanks to w3 School for the idea
                          // Create meter
                          document.getElementById("canvas_head").innerHTML = "0 &nbsp &nbsp &nbsp &nbsp &nbsp " +
                              "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" +
                              "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 100";
                          document.getElementById("canvas").style.border = "1px solid #000000";
                          var c = document.getElementById("canvas");
                          var ctx = c.getContext("2d");

                          // Create gradient
                          var grd = ctx.createLinearGradient(0,0,200,0);

                          // Set color for positive or negative
                          if(type=="positive")
                          {
                              grd.addColorStop(0,"green");
                          }
                          else
                          {
                              grd.addColorStop(0,"red");
                          }

                          grd.addColorStop(1,"white");
                            // Fill with gradient
                          ctx.fillStyle = grd;

                          ctx.fillRect(10,10,width,80);


                      });

               });



            }
    });