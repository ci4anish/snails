'use strict';

/**
 * @ngdoc service
 * @name angularTestGeneratorApp.services
 * @description
 * # services
 * Service in the angularTestGeneratorApp.
 */
angular.module('main')
  .factory('snailService', function ($q, $firebaseObject, $firebaseArray, $interval, $state, $timeout) {
    var appRef = new Firebase("https://snail-game.firebaseio.com/");
    // var snailsPositionsRef = new Firebase("https://snail-game.firebaseio.com/currentPosition");
    var checkingInterval;
    // function authHandler(error, authData) {
    //   if (error) {
    //     switch (error.code) {
    //       case "INVALID_EMAIL":
    //         console.log("The specified user account email is invalid.");
    //         break;
    //       case "INVALID_PASSWORD":
    //         console.log("The specified user account password is incorrect.");
    //         break;
    //       case "INVALID_USER":
    //         console.log("The specified user account does not exist.");
    //         break;
    //       default:
    //         console.log("Error logging user in:", error);
    //     }
    //   } else {
    //     console.log("Authenticated successfully with payload:", authData);
    //     $timeout(function(){$state.go("gameroom");}, 1000);
    //     //
    //     // userId = authData.uid;
    //     // appRef.child("users").child(authData.uid).update({
    //     //   authenticated: true
    //     // });
    //   }
    // }
    // function authDataCallback(authData) {
    //   if (authData) {
    //     console.log("User " + authData.uid + " is logged in with " + authData.provider);
    //     $timeout(function(){$state.go("gameroom");}, 1000);
    //
    //     return true;
    //   } else {
    //     console.log("Client unauthenticated.");
    //     $timeout(function(){$state.go("login");}, 1000);
    //
    //     return false;
    //   }
    // }

    function async(name) {
      var deferred = $q.defer();

      setTimeout(function() {
        deferred.notify('About to greet ' + name + '.');

        if (okToGreet(name)) {
          deferred.resolve('Hello, ' + name + '!');
        } else {
          deferred.reject('Greeting ' + name + ' is not allowed.');
        }
      }, 1000);

      return deferred.promise;
    }

    return {
      authentication: {
        createUser: function(userMail, userPassword, userName){
          var deferred = $q.defer();

          appRef.createUser({
              email    : userMail,
              password : userPassword
            }, function(error, userData) {
              if (error) {
                deferred.reject("Error creating user:", error);
              } else {
                deferred.resolve(userData);
                // console.log("Successfully created user account with uid:", userData.uid);

                appRef.child("users").child(userData.uid).set({
                  name: userName,
                  searchingGame: false
                });
              }
          });

          return deferred.promise;
        },
        logIn: function (userMail, userPassword) {
          var deferred = $q.defer();

          appRef.authWithPassword({
            email    : userMail,
            password : userPassword
          }, function (error, authData) {
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve(authData);
            }
          });

          return deferred.promise;
        },
        logOut: function () {
            appRef.unauth();
        },
        isAuth: function(){

          var deferred = $q.defer();

          appRef.onAuth(function (authData) {
            if (authData) {
              // console.log("User " + authData.uid + " is logged in with " + authData.provider);
              deferred.resolve(authData);
            } else {
              deferred.reject("Client unauthenticated.");
            }
          });

          return deferred.promise;
        },
        getUser: function(userId){
            var deferred = $q.defer();
          
            appRef.child("users").child(userId).on("value", function(snapshot) {
              deferred.resolve(snapshot.val());
             // console.log(snapshot.val());
           }, function (errorObject) {
              deferred.reject("The read failed: " + errorObject.code);
           });
          
          return deferred.promise;
        }
        // canselChecking: function(){
        //   console.log('Stop listening for changes');
        //   appRef.offAuth(authDataCallback);
        //   $interval.cancel(checkingInterval);
        // }
      },

      checkForPlayers: function(){
        // getting 3 users that are searching for game
        appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(3).on("value", function(snapshot) {
           console.log(snapshot.val());
         }, function (errorObject) {
           console.log("The read failed: " + errorObject.code);
        });
      }

      // getSnailsPositions: function(){
      //   snailsPositionsRef.on("value", function(snapshot, prevChildKey) {
      //     console.log(snapshot.val())
      //     return snapshot.val();
      //   });
      // }
    }
});
