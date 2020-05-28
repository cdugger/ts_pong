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
        (function ballLoop() {
            if (_this.isColliding(theBall, _this.playerOne) || _this.isColliding(theBall, _this.playerTwo)) {
                console.log(theBall.getCoords().y - _this.playerOne.getCoords().y);
                theBall.setAngle(theBall.getAngle() + 45);
                // change direction and angle
            }
            else if (_this.isColliding(theBall, Wall.right())) {
                _this.theBall.clearBall();
                _this.playerOne.setScore(_this.playerOne.getScore() + 1);
                document.getElementById("p1-score").textContent = _this.playerOne.getScore().toString();
                _this.theBall = new Ball();
                theBall = _this.theBall;
            }
            else if (_this.isColliding(theBall, Wall.left())) {
                _this.playerTwo.setScore(_this.playerTwo.getScore() + 1);
                document.getElementById("p2-score").textContent = _this.playerTwo.getScore().toString();
                _this.theBall = new Ball();
                theBall = _this.theBall;
            }
            else if (_this.isColliding(theBall, Wall.up()) || _this.isColliding(theBall, Wall.down())) {
                theBall.setAngle(theBall.getAngle() + 45);
            }
            theBall.moveBall();
            setTimeout(ballLoop, 0);
        })();
    };
    PongBoard.prototype.isColliding = function (a, b) {
        var aCoords = a.getCoords();
        var bCoords = b.getCoords();
        if (aCoords.x <= bCoords.x + bCoords.width &&
            aCoords.x + aCoords.width >= bCoords.x &&
            aCoords.y < bCoords.y + bCoords.height &&
            aCoords.y + aCoords.height > bCoords.y) {
            console.log(aCoords.y - bCoords.y);
            return true;
        }
        return false;
    };
    // 0 means player 1 gets a point 1 means player 2 got it. -1 means neither player got it.
    PongBoard.prototype.ballHitNet = function () {
        var ballCoords = this.theBall.getCoords();
        if (ballCoords.x + ballCoords.width <= 0) { // ball is off left side of board
            return 0;
        }
        else if (ballCoords.x - ballCoords.width / 2 >= PongBoard.getCanvasWidth()) { // off right side of board
            return 1;
        }
        return -1;
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
        canvas.addEventListener("mousemove", function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            console.log("x: " + x + "\n" + "y: " + y + "\n");
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
var Wall = /** @class */ (function () {
    function Wall(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Wall.prototype.getCoords = function () {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    };
    Wall.up = function () {
        return new Wall(0, 0, PongBoard.getCanvasWidth(), 1);
    };
    Wall.right = function () {
        return new Wall(PongBoard.getCanvasWidth(), 0, 1, PongBoard.getCanvasHeight());
    };
    Wall.down = function () {
        return new Wall(0, PongBoard.getCanvasHeight(), PongBoard.getCanvasWidth(), 1);
    };
    Wall.left = function () {
        return new Wall(0, 0, 1, PongBoard.getCanvasHeight());
    };
    return Wall;
}());
var BoardSide;
(function (BoardSide) {
    BoardSide[BoardSide["up"] = 0] = "up";
    BoardSide[BoardSide["right"] = 1] = "right";
    BoardSide[BoardSide["down"] = 2] = "down";
    BoardSide[BoardSide["left"] = 3] = "left";
})(BoardSide || (BoardSide = {}));
var Ball = /** @class */ (function () {
    function Ball() {
        this.ballRadius = 10;
        this.moveIncrement = 1;
        var canvas = document.getElementById("pong");
        var context = canvas.getContext("2d");
        this.xPos = PongBoard.getCanvasWidth() / 2;
        this.yPos = PongBoard.getCanvasHeight() / 2;
        this.currAngle = 20;
        //   context.fillRect(this.xPos - this.ballRadius-2, this.yPos-this.ballRadius-2, this.ballRadius*2+4, this.ballRadius*2+4);
        context.beginPath();
        //     context.strokeStyle = "#ffffff";
        context.arc(this.xPos, this.yPos, this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
        this.context = context;
    }
    Ball.prototype.getCoords = function () {
        return { x: this.xPos - this.ballRadius, y: this.yPos - this.ballRadius, width: this.ballRadius * 2 + 1, height: this.ballRadius * 2 + 1 };
    };
    Ball.prototype.moveBall = function () {
        this.clearBall();
        var context = this.context;
        this.xPos += this.moveIncrement * Math.cos(this.currAngle * Math.PI / 180);
        this.yPos += this.moveIncrement * Math.sin(this.currAngle * Math.PI / 180);
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
    };
    Ball.prototype.setAngle = function (angle) {
        //this.moveIncrement = -this.moveIncrement;
        this.currAngle = angle;
    };
    Ball.prototype.getAngle = function () {
        return this.currAngle;
    };
    Ball.prototype.clearBall = function () {
        var context = this.context;
        //context.clearRect(this.xPos - this.ballRadius - 2, this.yPos - this.ballRadius - 1, this.ballRadius*2 + 2, this.ballRadius*2 + 2);
        context.clearRect(this.xPos - this.ballRadius - 2, this.yPos - this.ballRadius - 2, this.ballRadius * 2 + 4, this.ballRadius * 2 + 4);
        context.stroke();
    };
    return Ball;
}());
var Player = /** @class */ (function () {
    function Player(side, isAi) {
        this.score = 0;
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
    Player.prototype.getCoords = function () {
        return { x: this.xPos, y: this.yPos, width: this.paddleWidth, height: this.paddleHeight };
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
    Player.prototype.getScore = function () {
        return this.score;
    };
    Player.prototype.setScore = function (newScore) {
        this.score = newScore;
    };
    Player.prototype.changeYPosBy = function (yOffset) {
        var context = this.context;
        context.clearRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight); //todo
        context.fillRect(this.xPos, this.yPos + yOffset, this.paddleWidth, this.paddleHeight);
        this.yPos = this.yPos + yOffset;
    };
    return Player;
}());
var p = new PongBoard(false, false);
