'use strict';

/**
 * @ngdoc service
 * @name angularTestGeneratorApp.services
 * @description
 * # services
 * Service in the angularTestGeneratorApp.
 */
angular.module('main')
  .factory('snailService', function ($rootScope, $q, $firebaseObject, $firebaseArray, $interval, $state, $timeout) {
    var appRef = new Firebase("https://snail-game.firebaseio.com/");

    function size(obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
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
      },

      checkForPlayers: function(userId){

        $rootScope.showSpinner = true;

        // var deferred = $q.defer();

        console.log("Start searching");

        appRef.child("users").child(userId).update({
          searchingGame: true
        });

        // getting 3 users that are searching for game
        appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(3).on("value", function(snapshot) {

          // deferred.resolve(snapshot.val());
           console.log(size(snapshot.val()));

         }, function (errorObject) {
          // deferred.reject("The read failed: " + errorObject.code);
        });

        $timeout(function(){
          appRef.child("users").child(userId).update({
            searchingGame: false
          });
          console.log("Finish searching");

          $rootScope.showSpinner = false;
        }, 15000);

        // return deferred.promise;
      }

      // getSnailsPositions: function(){
      //   snailsPositionsRef.on("value", function(snapshot, prevChildKey) {
      //     console.log(snapshot.val())
      //     return snapshot.val();
      //   });
      // }
    }
});
