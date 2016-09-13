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




angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope, $http) {



        $scope.myFunction = function(){

            var sourceText = document.getElementById("sourceText").value;
            var sourceLanguage = document.getElementById("from").value;
            var targetLanguage = document.getElementById("to").value;

           $http.get("https://www.googleapis.com/language/translate/" + "v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM&source=" + sourceLanguage + "&target=" + targetLanguage + "&q=" + sourceText)
               .then(function(response){

                   $scope.transText = "Translation: " + response.data.data.translations[0].translatedText;
                  var transText =  "Translation: " + response.data.data.translations[0].translatedText;


                  $http.get("https://api.uclassify.com/v1/uClassify/Sentiment/classify/?readKey=yyckHiiOgGhQ&texts=hi")
                      .then(function(response){
                          alert(response.data);
                          $scope.pos =  "Positive: " + response.data;

                      });

               });



            }
    });