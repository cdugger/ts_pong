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
        this.startGame();
    }
    PongBoard.prototype.startGame = function () {
        var theBall = this.theBall;
        var _this = this;
        (function ballLoop(counter) {
            console.log(counter);
            console.log(_this.isColliding(theBall, _this.playerOne));
            theBall.moveBall();
            setTimeout(ballLoop, 0, counter + 1);
        })(0);
    };
    PongBoard.prototype.isColliding = function (a, b) {
        var aCoords = a.getCollisionCoords();
        var bCoords = b.getCollisionCoords();
        return true;
    };
    PongBoard.prototype.addPlayerMovement = function () {
        var _this_1 = this;
        var canvas = this.canvas;
        canvas.addEventListener("keydown", function (e) {
            if (e.key == "ArrowUp") {
                _this_1.playerOne.moveUp();
            }
            else if (e.key == "ArrowDown") {
                _this_1.playerOne.moveDown();
            }
            else if (e.key == "w") {
                _this_1.playerTwo.moveUp();
            }
            else if (e.key == 's') {
                _this_1.playerTwo.moveDown();
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
        this.moveIncrement = .25;
        var canvas = document.getElementById("pong");
        var context = canvas.getContext("2d");
        this.xPos = PongBoard.getCanvasWidth() / 2;
        this.yPos = PongBoard.getCanvasHeight() / 2;
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
        this.context = context;
    }
    Ball.prototype.getCollisionCoords = function () {
        throw new Error("Method not implemented.");
    };
    Ball.prototype.moveBall = function () {
        var context = this.context;
        context.clearRect(this.xPos - this.ballRadius - 1, this.yPos - this.ballRadius - 1, this.ballRadius * 2, this.ballRadius * 2);
        this.xPos += this.moveIncrement;
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
    };
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
    Player.prototype.getCollisionCoords = function () {
        return [this.xPos, this.xPos + this.paddleWidth, this.yPos, this.yPos + this.paddleHeight];
    };
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
    return Player;
}());
var p = new PongBoard(false, false);
