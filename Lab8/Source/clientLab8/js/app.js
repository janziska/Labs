/**
 * Created by janziska on 9/9/2016.
 */
'use strict';




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

// sign in actions with Google
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

// Once signed in to Google, go to main translation page
function onSuccess(googleUser) {
    console.log('Signed in as: ' + googleUser.getBasicProfile().getName());
    window.location.href="translate.html";
}

// Code for translation module
angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope, $http) {

        $scope.showBar = function(show){

            if (show > 0)
                return true;
            else
                return false;
        }

        $scope.myFunction = function(){

            // Get form info
            var sourceText = document.getElementById("sourceText").value;
            var sourceLanguage = document.getElementById("from").value;
            var targetLanguage = document.getElementById("to").value;

            // translate the text
           $http.get("http://localhost:8080/Lab8Server/lab8Service/?&source="
               + sourceLanguage + "&target=" + targetLanguage + "&q=" + sourceText)
               .then(function(response){

                   // Angular broke Google Sign Out so I had to stop using it
                   $scope.score =  "Score: " + parseFloat(response.data.docSentiment.score*100).toFixed(0);
                   $scope.type =   "Type:  " +  response.data.docSentiment.type;
                   $scope.transText = "Translated Text: " + response.data.translatedText;

                          // Set width pasted on score
                   var percent = parseFloat(response.data.docSentiment.score*100).toFixed(0);
                   $scope.percent = parseFloat(response.data.docSentiment.score*100).toFixed(0);
                   var type = response.data.docSentiment.type;
                   //var transText =   response.data.translatedText;
                   // thanks to w3 School for the idea
                   // Create meter
                   if(type == "positive")
                   {
                       $scope.state = "progress-bar-success";
                       $scope.myStyle = {width: percent + '%'};
                   }
                   else
                   {
                       $scope.state = "progress-bar progress-bar-danger";
                       $scope.myStyle = {width: -1*percent + '%'};
                   }
               });

        }
    });