angular.module('TicTacToe.game', [])

    .directive('miniTicTacToe', function () {
        return {
            restrict: 'E',
            scope: {
                miniBoard: '='
            },
            templateUrl: 'templates/miniTicTacToe.html',
            replace: true,
            link: function(scope) {

            }
        };
    })

    .factory('GameService', function () {
        return {
            board: new BigBoard(),
            sendPick: sendPick()
        };

        function sendPick(cell) {
            // socket
        }
    })

    .controller('GameCtrl', ['GameService', function (GameService) {
        var game = this;

        game.player = 'x';

        game.board = GameService.board;

        game.pick = function(cell) {
            if (!cell.board.isAlowed) return;

            cell.value = game.player;
            game.player = game.player === 'x' ? 'o' : 'x';
            //GameService.sendPick(cell);

            if (cell.board.getWinner()) {
                console.log(cell.board.winner);
                game.board.getWinner() ? alert(game.board.getWinner()) : null;
            }

            var boardIsFull = game.board.board[cell.x][cell.y].isFull();

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = boardIsFull;
                });
            });

            game.board.board[cell.x][cell.y].isAlowed = !boardIsFull;
        }
    }]);



function Cell(x, y, board) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.value = undefined;
}

function SmallBoard(x, y) {
    this.x = x;
    this.y = y;
    this.isAlowed = true;
    this.winner = undefined;
    this.board = [];

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new Cell(i, j, this));
        }
    }
}

SmallBoard.prototype.isFull = function () {
    for (var row in this.board) {
        for (var cell in row)
            if (cell.value === undefined) return false;
    }

    return true;
};

SmallBoard.prototype.getWinner = function () {
    var wins = [ [[0,0],[0,1], [0,2]],[[1,0],[1,1], [1,2]],[[2,0],[2,1], [2,2]],
        [[0,0],[1,0], [2,0]],[[0,1],[1,1], [2,1]],[[0,2],[1,2], [2,2]],
        [[0,0],[1,1], [2,2]],[[0,2],[1,1], [2,0]]];

    var that = this;

    if (that.winner) return that.winner;

    wins.forEach(function(win){
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].value === that.board[win[1][0]][win[1][1]].value &&
            that.board[win[0][0]][win[0][1]].value === that.board[win[2][0]][win[2][1]].value &&
            that.board[win[0][0]][win[0][1]].value != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].value;
        }
    });

    return that.winner;
};

function BigBoard() {
    this.board = [];
    this.winner = undefined;

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new SmallBoard(i, j));
        }
    }
}

BigBoard.prototype.getWinner = function () {
    var wins = [ [[0,0],[0,1], [0,2]],[[1,0],[1,1], [1,2]],[[2,0],[2,1], [2,2]],
        [[0,0],[1,0], [2,0]],[[0,1],[1,1], [2,1]],[[0,2],[1,2], [2,2]],
        [[0,0],[1,1], [2,2]],[[0,2],[1,1], [2,0]]];

    var that = this;

    if (that.winner) return that.winner;

    wins.forEach(function(win){
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].winner === that.board[win[1][0]][win[1][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner === that.board[win[2][0]][win[2][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].winner;
        }
    });

    return that.winner;
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