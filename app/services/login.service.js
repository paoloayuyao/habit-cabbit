/**
 * Created by jayuyao on 10/31/2016.
 */

(function(){

});

angular.module('app').service('LoginService', function () {



  this.login = function login(username, password) {
    console.log('userpass: ' + username + ' ' + password);

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('errorCode: ' + errorCode);
      console.log('errorMessage: ' + errorMessage);
    });
    console.log('haha it works! done');
  }

  this.isUserLoggedIn = function () {
    var user = firebase.auth().currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  this.logout = function () {
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.auth().signOut().then(function () {
        alert('Bye!');
      }, function (error) {
        alert(error);
      });
    }
  }

});
