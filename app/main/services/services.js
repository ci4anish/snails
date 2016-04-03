'use strict';

/**
 * @ngdoc service
 * @name angularTestGeneratorApp.services
 * @description
 * # services
 * Service in the angularTestGeneratorApp.
 */
angular.module('main')
  .factory('snailService', function ($firebaseObject, $firebaseArray, $interval) {
    var appRef = new Firebase("https://snail-game.firebaseio.com/");
    var snailsPositionsRef = new Firebase("https://snail-game.firebaseio.com/currentPosition");
    var userId, checkingInterval;
    function authHandler(error, authData) {
      if (error) {
        switch (error.code) {
          case "INVALID_EMAIL":
            console.log("The specified user account email is invalid.");
            break;
          case "INVALID_PASSWORD":
            console.log("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            break;
          default:
            console.log("Error logging user in:", error);
        }
      } else {
        console.log("Authenticated successfully with payload:", authData);

        userId = authData.uid;
        appRef.child("users").child(userId).update({
          authenticated: true,
        });
      }
    };
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("Client unauthenticated.")
      }
    }

    return {
      authentication: {
        createUser: function(userMail, userPassword, userName){
          appRef.createUser({
              email    : userMail,
              password : userPassword
            }, function(error, userData) {
              if (error) {
                console.log("Error creating user:", error);
              } else {
                console.log("Successfully created user account with uid:", userData.uid);
                appRef.child("users").child(userData.uid).set({
                  name: userName,
                  authenticated: false,
                  searchingGame: false
                });
              }
          });
        },
        logIn: function (userMail, userPassword) {
          appRef.authWithPassword({
            email    : userMail,
            password : userPassword
          }, authHandler);
        },
        logOut: function () {
          if(userId){
            appRef.unauth();
            appRef.child("users").child(userId).update({
                authenticated: false,
            });
            console.log('Logged out')
          }else{
            console.log('You need to log in first');
          }
        },
        isAuth: function(intervalRange){
          checkingInterval = $interval(function(){
            appRef.onAuth(authDataCallback);
          }, intervalRange);
        },
        canselChecking: function(){
           console.log('Stop listening for changes');
           appRef.offAuth(authDataCallback);
           $interval.cancel(checkingInterval);
        },
        getUser: function(){
            if(userId){
                appRef.child("users").child(userId).on("value", function(snapshot) {
                 console.log(snapshot.val());
               }, function (errorObject) {
                 console.log("The read failed: " + errorObject.code);
               });
            }
        }
      },

      checkForPlayers: function(){
        // getting 3 users that are searching for game
        appRef.child("users").orderByChild("searchingGame").equalTo(true).limitToFirst(3).on("value", function(snapshot) {
           console.log(snapshot.val());
         }, function (errorObject) {
           console.log("The read failed: " + errorObject.code);
        });
      },

      // getSnailsPositions: function(){
      //   snailsPositionsRef.on("value", function(snapshot, prevChildKey) {
      //     console.log(snapshot.val())
      //     return snapshot.val();
      //   });
      // }
    }
});
