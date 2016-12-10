/**
 * Created by jayuyao on 11/19/2016.
 */
(function(){

  function AuthFactory($firebaseAuth){
    return $firebaseAuth();
  }

  AuthFactory.$inject = ['$firebaseAuth'];

  angular.module('app').factory('AuthFactory', AuthFactory);

})();
