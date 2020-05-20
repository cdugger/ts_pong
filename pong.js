var PongBoard = /** @class */ (function () {
    function PongBoard(playerOneIsAI, playerTwoIsAI) {
        var canvas = document.getElementById("pong");
        var context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;
        this.playerOne = new Player(BoardSide.left, playerOneIsAI);
        this.playerTwo = new Player(BoardSide.right, playerTwoIsAI);
        this.theBall = new Ball();
        this.addPlayerMovement();
        this.createBoardSideSplit();
    }
    PongBoard.prototype.addPlayerMovement = function () {
        var _this = this;
        var canvas = this.canvas;
        canvas.addEventListener("keydown", function (e) {
            if (e.key == "ArrowUp") {
                _this.playerOne.moveUp();
            }
            else if (e.key == "ArrowDown") {
                _this.playerOne.moveDown();
            }
            else if (e.key == "w") {
                _this.playerTwo.moveUp();
            }
            else if (e.key == 's') {
                _this.playerTwo.moveDown();
            }
        });
    };
    PongBoard.prototype.createBoardSideSplit = function () {
        var context = this.context;
        context.beginPath();
        context.moveTo(PongBoard.getCanvasWidth() / 2, 0);
        context.lineTo(PongBoard.getCanvasWidth() / 2, PongBoard.getCanvasHeight());
        context.stroke();
    };
    PongBoard.getCanvasWidth = function () {
        return parseInt(document.getElementById("pong").getAttribute("width"));
    };
    PongBoard.getCanvasHeight = function () {
        return parseInt(document.getElementById("pong").getAttribute("height"));
    };
    return PongBoard;
}());
var BoardSide;
(function (BoardSide) {
    BoardSide[BoardSide["left"] = 0] = "left";
    BoardSide[BoardSide["right"] = 1] = "right";
})(BoardSide || (BoardSide = {}));
var Ball = /** @class */ (function () {
    function Ball() {
        this.ballRadius = 10;
        var canvas = document.getElementById("pong");
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(PongBoard.getCanvasWidth() / 2, PongBoard.getCanvasHeight() / 2, this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
    }
    return Ball;
}());
var Player = /** @class */ (function () {
    function Player(side, isAi) {
        this.paddleWidth = 20; // width of the pong paddle(?)
        this.paddleHeight = 50;
        this.paddlePadding = 20; // distance from edge of board to paddle
        this.moveIncrement = 5; // number of pixels to move paddle each call
        var canvas = document.getElementById("pong");
        var context = canvas.getContext("2d");
        this.context = context;
        this.yPos = this.paddlePadding;
        if (side == BoardSide.left) {
            this.xPos = this.paddlePadding;
            context.fillRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight);
            context.stroke();
        }
        else {
            this.xPos = PongBoard.getCanvasWidth() - this.paddleWidth - this.paddlePadding; // accounts for paddle width
            context.fillRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight);
            context.stroke();
        }
    }
    Player.prototype.moveUp = function () {
        if (this.yPos - this.moveIncrement >= this.paddlePadding) {
            this.changeYPosBy(-this.moveIncrement);
        }
    };
    Player.prototype.moveDown = function () {
        if (this.yPos + this.moveIncrement < (PongBoard.getCanvasHeight() - this.paddleHeight) - this.paddlePadding) {
            this.changeYPosBy(this.moveIncrement);
        }
    };
    Player.prototype.changeYPosBy = function (yOffset) {
        var context = this.context;
        context.clearRect(this.xPos, this.paddlePadding, this.paddleWidth, 1200);
        context.fillRect(this.xPos, this.yPos + yOffset, this.paddleWidth, this.paddleHeight);
        this.yPos = this.yPos + yOffset;
    };
    // return [x1, x2, y1, y2]
    Player.prototype.getCurrentOccupiedCoords = function () {
        var coords = [];
        coords.push(this.xPos); // x1
        coords.push(this.xPos + this.paddleWidth); // x2
        coords.push(this.yPos); // y1
        coords.push(this.yPos + this.paddleHeight); // y2
        return coords;
    };
    return Player;
}());
var p = new PongBoard(false, false);
