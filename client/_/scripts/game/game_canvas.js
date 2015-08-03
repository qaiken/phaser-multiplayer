var game = angular.module('phaserApp.game');
var createGame = require('./create_game');

game.directive('gameCanvas', ['$rootScope', 'User', 'UUID', 'gameSocket', '$injector', function($rootScope, User, UUID, gameSocket, $injector) {

  var newUser = function(cb) {
    if( User.getCurrentUser() ) {
      cb();
      return;
    }

    alertify.prompt("Please enter a username.", function (e, input) {
      var userName = input || 'Player';
      var user = {
        userName: userName,
        health: 100,
        id: UUID()
      };

      User.setCurrentUser(user);

      $rootScope.$emit('game:newPlayer', user);

      cb();

    },'');
  }

  var linkFn = function(scope, el, attrs) {

    var opts = {
      el: el,
      scope: scope.gamectrl,
      socket: gameSocket,
      players: scope.gamectrl.players,
      $injector: $injector
    };

    newUser(function() {
      createGame(opts);
    });

  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div id="game-canvas"></div>',
    controller: 'GameController as gamectrl',
    link: linkFn
  };

}]);