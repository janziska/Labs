angular.module('starter.services', [])

// Login for user
.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw, uname, upass) {
            
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            // Checks default and registered user in local storage
            if ((name == 'user' && pw == 'secret') || (name == uname && pw == upass)) {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                // try again
                deferred.reject('Wrong credentials.');
            }
            // Worked
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})



