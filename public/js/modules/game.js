angular.module('TicTacToe.game', [])

    .directive('miniTicTacToe', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/miniTicTacToe.html',
            replace: true,
            link: function() {

            }
        }
    })

    .controller('GameCtrl', function () {

    });

//function Square(x, y, mini) {
//    this.x = x;
//    this.y = y;
//    this.mini = mini;
//};
//
//Square.prototype.fill = function (player) {
//    this.player = player;
//};
//
//function init() {
//    var board = [];
//    for (var i = 0; i < 10; i++) {
//        for (var j = 0; j < 10; j++) {
//            board.push(new Square(i, j));
//        }
//    }
//
//    return board;
//}