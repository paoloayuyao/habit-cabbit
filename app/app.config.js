/**
 * Created by jayuyao on 10/29/2016.
 */
angular.module('app').config(['$stateProvider','$urlRouterProvider', '$locationProvider', 'ngToastProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, ngToastProvider) {

  $locationProvider.hashPrefix('!')

  var indexState = {
    name: 'index',
    templateUrl: 'index.html',
    abstract: true
  }

  var loginState = {
    url: '/login',
    name: 'login',
    parent: 'index',
    component: 'login'
  }

  var appState = {
    name: 'app',
    parent: 'index',
    templateUrl: 'app/views/app.template.html',
    abstract: true
  }

  var dashboardState = {
    url: '/dashboard',
    name: 'app.dashboard',
    template: '<p>This is a dashboard placeholder.</p>',
    authenticated: true,
    roles: ['ADMIN', 'USER']
  }

  var taskListState = {
    url: '/tasks',
    name: 'app.tasks',
    component: 'taskList'
  }

  $stateProvider.state(indexState);
  $stateProvider.state(loginState);
  $stateProvider.state(appState);
  $stateProvider.state(dashboardState);
  $stateProvider.state(taskListState);

  $urlRouterProvider.otherwise('/login');

  ngToastProvider.configure({
    verticalPosition: 'top',
    horizontalPosition: 'center',
    combineDuplications: true
  });

}]).run(function($rootScope, $state, $transitions, AuthFactory){

  AuthFactory.$onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
      console.log('CONFIGUUUU firebase user ready');
      $rootScope.currentUser = firebaseUser;
    } else {
      console.log('CONFIGUUUU firebase user is NOT ready');
    }
  })

  // https://github.com/angular-ui/ui-router/issues/2720
  // stateChange events are deprecated; fun

  // http://stackoverflow.com/questions/36962954/angular-ui-router-transitions-onbefore need this eventually

  // https://ui-router.github.io/docs/latest/classes/transition.transitionservice.html
  // may not have to run this within the run function

  $transitions.onBefore( { to: 'app.**' }, function(trans) {
    // the trans variable contains information on WHERE you want to go, we can compare this with the contents of the
    // token
    var firebaseUser = AuthFactory.$getAuth();
    if(firebaseUser){

    }

    return true;
  });


});

