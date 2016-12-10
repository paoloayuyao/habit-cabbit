/**
 * Created by jayuyao on 10/29/2016.
 */

(function () {

  function TaskController($rootScope, $scope, $firebaseArray, $firebaseObject, AuthFactory, $state, $uibModal, ngToast) {

    var vm = this;
    var today = new Date();
    var currentMonth = today.getMonth() + 1;
    var currentYear = today.getFullYear();
    var currentPeriod = currentMonth + '' + currentYear;
    var user = null;
    var modalInstance;

    vm.days = [];
    vm.tasks = [];
    vm.currentUser = null;
    vm.newHabit = null;
    vm.alerts = [];
    vm.loading = false;
    vm.weekDays = [];

    $scope.Auth = AuthFactory;

    vm.Auth = AuthFactory;

    $scope.Auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        $rootScope.currentUser = firebaseUser;
        vm.currentUser = firebaseUser;
        user = firebaseUser;
        loadTasks();

      } else {
        $state.go('login');
      }
    })

    TaskController.prototype.addTask = function () {
     /* var days = daysInMonth(currentMonth, currentYear);
      var newTask = createNewTask(days);
      vm.tasks.$add(newTask)*/
    }

    TaskController.prototype.synchronize = function (object) {
      vm.tasks.$save(object);
    }

    TaskController.prototype.delete = function (object){
      vm.tasks.$remove(object);
    }

    TaskController.prototype.show = function(index){
      for(var i = 0; i < vm.weekDays.length; i++){
        var day = vm.weekDays[i];
        if(index == day){
          return true;
        }
      }
      return false;
    }

    TaskController.prototype.addHabit = function () {
      vm.loading = true;

      var days = daysInMonth(currentMonth, currentYear);
      var newTask = createNewTask(days, vm.newHabit);

      var existing = false;
      for(var i = 0; i < vm.tasks.length; i++){
        var task = vm.tasks[i];
        if(task.name){
          if(task.name.toUpperCase() === newTask.name.toUpperCase()){
            existing = true;
            break;
          }
        }
      }

      if(existing){
        ngToast.warning({
          content: 'Habit "' + newTask.name + '" already exists.'
        });
      } else {
        vm.tasks.$add(newTask)
        ngToast.success({
          content: 'Habit "' + vm.newHabit +  '" added!'
        });
        vm.newHabit = null;
      }

      vm.loading = false;
    }

    function loadTasks() {
      vm.loading = true;
      var tasksRef = firebase.database().ref('users/' + user.uid + '/tasks');
      tasksRef.child(currentPeriod).once('value', function (snap) {
        if (snap.exists()) {
          vm.tasks = $firebaseArray(tasksRef.child(currentPeriod));
          vm.days = createDayArray(snap.val().days);
          vm.loading = false;
          identifyWeekDays();
        } else {
          var days = daysInMonth(currentMonth, currentYear);
          var newTask = createNewTask(days);
          tasksRef.child(currentPeriod).set({
            days: daysInMonth(currentMonth, currentYear)
          })
          tasksRef.child(currentPeriod).push(newTask);
          vm.tasks = $firebaseArray(tasksRef.child(currentPeriod));
          vm.days = createDayArray(days);
          vm.loading = false;
          identifyWeekDays();
        }
      });
    }

    function identifyWeekDays(){
      var date = new Date();

      var currentDate = date.getDate();

      var afterDates = [];
      for(var i = currentDate; i <= vm.days.length; i++){
        if(afterDates.length < 4){
          afterDates.push(i);
        }
      }

      var adjustment = 4 - afterDates.length;
      if(adjustment < 0){
        adjustment = 0;
      }

      var beforeDates = [];
      for(var i = currentDate; i > 0; i--){
        if(i > 0){
          if(beforeDates.length < 4 + adjustment){
            beforeDates.push(i);
          }
        }
      }

      adjustment = 4 - beforeDates.length;

      var lastAfter = afterDates[afterDates.length - 1];

      for(var i = 1; i < adjustment + 1; i++){
        var newAfter = lastAfter + i;
        afterDates.push(newAfter);
      }

      var newArray = beforeDates.concat(afterDates);
      var filteredArray = newArray.filter(function (item, pos) {return newArray.indexOf(item) == pos});

      console.log(filteredArray)

      vm.weekDays = filteredArray;

    }

  }

  TaskController.$inject = ['$rootScope', '$scope', '$firebaseArray', '$firebaseObject', 'AuthFactory', '$state', '$uibModal', 'ngToast'];

  angular.module('app').component('taskList', {
    templateUrl: 'app/components/task-list/task-list.template.html',
    controller: TaskController,
    controllerAs: 'taskCtrl'
  })

  function createNewTask(days, name) {
    var task = new Task();
    task.name = name;
    for (var day = 0; day < days; day++) {
      var correctedDay = day + 1;
      task.days[correctedDay] = false;
    }
    return task;
  }

  function Task() {
    this.name = 'Sample Task';
    this.days = []
  }

  function daysInMonth(month, year) {
    console.log('month ' + month + ' year ' + year);
    return new Date(year, month, 0).getDate();
  }

  function createDayArray(days) {
    var dayArray = [];
    for (var i = 0; i < days; i++) {
      dayArray[i] = i + 1;
    }
    return dayArray;
  }

})();
