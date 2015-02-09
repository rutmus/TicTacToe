angular.module('TicTacToe.game', [])

    .directive('miniTicTacToe', function () {
        return {
            restrict: 'E',
            scope: {
                smallBoard: '@'
            },
            templateUrl: 'templates/miniTicTacToe.html',
            replace: true,
            link: function() {

            }
        }
    })

    .factory('GameService', function () {
        return {
            board: new bigBoard()
        };
    })

    .controller('GameCtrl', ['GameService', function (GameService) {
        this.board = GameService.board;
    }]);



function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.value = null;
};

function smallBoard(x, y) {
    this.x = x;
    this.y = y;

    this.board = [];

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new Cell(i, j));
        }
    }
};

function bigBoard() {
    this.board = [];

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new smallBoard(i, j));
        }
    }
};

//Square.prototype.fill = function (player) {
//    this.player = player;
//};
//
//function init() {
//    var board = [];
//    for (var i = 0; i < 3; i++) {
//        for (var j = 0; j < 3; j++) {
//            board.push(new Cell(i, j));
//        }
//    }
//
//    return board;
//}