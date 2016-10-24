var myApp = angular.module('myApp', []);

// Variables for returning the text
var originalText;
var translatedText;

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {

    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

            .success(function (data, status, headers, config) {
                console.log(data.response);
                originalText = data.response.originalText;
                translatedText = data.response.translatedText;
                console.log( originalText);
                console.log(translatedText);


                // Display text
                document.getElementById("name").innerHTML = "Original Text: " + originalText;
                document.getElementById("translated").innerHTML = "New Text: " + translatedText;




            })
            .error(function (data, status, header, config) {
                alert(status + " " + data);

            });
    }
}]);

myApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
        var sourceLanguage = document.getElementById("from").value;
        var targetLanguage = document.getElementById("to").value;
        var file = $scope.myFile;
        console.log(sourceLanguage);

        console.log('file is ' );
        console.dir(file);

            var uploadUrl = "http://127.0.0.1:8081/photo/?source=" + sourceLanguage + "&target=" + targetLanguage;

            fileUpload.uploadFileToUrl(file, uploadUrl);


    };



}]);
/**
 * Created by janziska on 10/21/2016.
 */
