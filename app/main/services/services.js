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

    var gameId = '', globalUId, timeout, gameObjects;
    var functionTime = 15000;
    var players = 3;

    function searchingUsersCallback(snapshot) {
      var counter = 0;

      if(size(snapshot.val()) === players){

        gameObjects = snapshot.val();

        for(var usersId in snapshot.val()){

          appRef.child("users").child(usersId).update({
            searchingGame: false
          });
          gameId += usersId;
          counter++;
        }
      }

      if(counter === players){
          appRef.child('gamerooms').child(gameId).child(globalUId).set({
            name: $rootScope.gameUser.name,
            snailValue: 0
          });
          console.log(gameId);
          appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(players).off("value", searchingUsersCallback);
          console.log('Found players');
          $timeout.cancel(timeout);
          $rootScope.showSpinner = false;
          $state.go('gameroom');
      }

    }

    // function searchingUsersError(errorObject) {
    //   console.log(errorObject);
    // }


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

      game: {
        checkForPlayers: function(userId){

          globalUId = userId;

          $rootScope.showSpinner = true;

          console.log("Start searching");

          appRef.child("users").child(userId).update({
            searchingGame: true
          });

          // appRef.child("users").child(userId).child("searchingGame").on("value", onFoundCallback);

          // getting users that are searching for game - hardcoded "players" for now
          appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(players).on("value", searchingUsersCallback);

          timeout = $timeout(function(){
            // appRef.child("users").child(userId).child("searchingGame").off("value", onFoundCallback);
            appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(players).off("value", searchingUsersCallback);

            appRef.child("users").child(userId).update({
              searchingGame: false
            });
            console.log("No players were found");

            $rootScope.showSpinner = false;
          }, functionTime);

        },

        getGame: function(){
          return gameObjects;
        },

        move: function(value){
          appRef.child('gamerooms').child(gameId).child(globalUId).update({
            snailValue: value
          });
        },

        getSnailsPos: function(){

          var deferred = $q.defer();

          appRef.child('gamerooms').child(gameId).on("value", function(snapshot) {
            deferred.resolve(snapshot.val());
          }, function (errorObject) {
            deferred.reject(errorObject);
          });

          return deferred.promise;
        },

        removeGame: function(){
          appRef.child('gamerooms').child(gameId).remove();
          gameId = '';
        }
      }

    }
});
