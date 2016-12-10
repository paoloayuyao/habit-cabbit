/**
 * Created by jayuyao on 10/30/2016.
 */

(function () {

  function LoginController($rootScope, $scope, $firebaseAuth, AuthFactory, $firebaseObject, $state) {

    var vm = this;

    vm.loginDetails = new LoginDetails();

    $scope.Auth = AuthFactory;

    $scope.Auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        var currentDate = new Date();
        var user = firebaseUser;
        var usersRefClone = firebase.database().ref('users/');
        usersRefClone.child(user.uid).once('value', function(snap){
          console.log('child node exists? ' + snap.exists())
          if(snap.exists()){
            $state.go('app.tasks');
          } else {
            var usersRef = firebase.database().ref('users/' + user.uid);
            usersRef = $firebaseObject(usersRef);
            usersRef.uid = user.uid;
            usersRef.lastLogin = {
              date: currentDate.getDay(),
              month: currentDate.getMonth() + 1,
              year: currentDate.getFullYear()
            }
            usersRef.$save().then(function(){
              $state.go('app.tasks');
            }).catch(function(error){
              // TODO add error handling here
            });
          }
        });
      } else {
        $state.go('login');
      }
    })

    LoginController.prototype.login = function () {

      var auth = $firebaseAuth();

      auth.$signInWithPopup("google").then(function (response) {
        var user = response.user;
        console.log('login complete, waiting for onauth listener')
      }).catch(function (error) {
        $rootScope.currentUserLoggedIn = false;
      });

    }

    function LoginDetails() {
      this.username = '';
      this.password = '';
    }

  }

  LoginController.$inject = ['$rootScope', '$scope', '$firebaseAuth', 'AuthFactory', '$firebaseObject', '$state']

  angular.module('app').component('login', {
    templateUrl: 'app/components/login/login.template.html',
    controller: LoginController
  });

})();






