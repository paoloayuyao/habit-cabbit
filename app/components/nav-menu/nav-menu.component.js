/**
 * Created by jayuyao on 12/8/2016.
 */
(function () {

  function NavMenuController($state, AuthFactory) {
    var vm = this;
    vm.showLogout = true;
    vm.Auth = AuthFactory;

    vm.Auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        vm.showLogout = true;
      } else {
        vm.showLogout = false;
      }
    })

    NavMenuController.prototype.logout =  function(){
      vm.Auth.$signOut();
      $state.go('login');
    }

  }

  NavMenuController.$inject = ['$state','AuthFactory'];

  angular.module('app').component('navMenu', {
    templateUrl: 'app/components/nav-menu/nav-menu.template.html',
    controller: NavMenuController,
    controllerAs: 'navMenuCtrl'
  })

})();
