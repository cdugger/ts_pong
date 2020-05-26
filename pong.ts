class PongBoard {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private playerOne: Player;
    private playerTwo: Player;
    private theBall: Ball;

    constructor(playerOneIsAI: boolean, playerTwoIsAI: boolean) {
        let canvas = document.getElementById("pong") as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;

        this.playerOne = new Player(BoardSide.left, playerOneIsAI);
        this.playerTwo = new Player(BoardSide.right, playerTwoIsAI);
        this.theBall = new Ball();
        this.addPlayerMovement();
        this.createBoardSideSplit();
        this.startGame();
    }

    private startGame() : void {
        let theBall = this.theBall;
        let _this = this;
        (function ballLoop(){
            let ballHitNet: number = _this.ballHitNet();
            if(_this.isColliding(theBall, _this.playerOne) || _this.isColliding(theBall, _this.playerTwo)) {
                console.log(theBall.getCoords().y - _this.playerOne.getCoords().y);
                theBall.setAngle(theBall.getAngle()+45);
                // change direction and angle
            } else if(ballHitNet != -1) {
                _this.theBall.clearBall();
                let currScore: number;
                if(ballHitNet == 0) {
                    currScore = _this.playerOne.getScore();
                    _this.playerOne.setScore(currScore + 1);
                    document.getElementById("p2-score").textContent = (currScore + 1).toString();
                } else {
                    currScore = _this.playerTwo.getScore();
                    _this.playerTwo.setScore(currScore + 1);
                    document.getElementById("p1-score").textContent = (currScore + 1).toString();
                }
                _this.theBall = new Ball();
                theBall = _this.theBall;
            }
            theBall.moveBall();
            setTimeout(ballLoop,0);
        })();
    }

    private isColliding(a: Collidable, b: Collidable): boolean {
        let aCoords : ItemSize = a.getCoords();
        let bCoords : ItemSize = b.getCoords();
        if (aCoords.x <= bCoords.x + bCoords.width &&
            aCoords.x + aCoords.width >= bCoords.x &&
            aCoords.y < bCoords.y + bCoords.height &&
            aCoords.y + aCoords.height > bCoords.y) {
            console.log(aCoords.y - bCoords.y);
            return true;
        }
        return false;
    }

    // 0 means player 1 gets a point 1 means player 2 got it. -1 means neither player got it.
    private ballHitNet(): number {
        let ballCoords = this.theBall.getCoords();
        if(ballCoords.x + ballCoords.width <= 0) { // ball is off left side of board
            return 0;
        } else if(ballCoords.x - ballCoords.width/2 >= PongBoard.getCanvasWidth()) { // off right side of board
            return 1;
        }
        return -1;
    }

    private ballHitEdge(): boolean {

        return false;
    }

    private addPlayerMovement(): void {
        let canvas = this.canvas;
        canvas.addEventListener("keydown", (e) => {
            if(e.key == "ArrowUp") {
                this.playerOne.moveUp();
            } else if(e.key == "ArrowDown") {
                this.playerOne.moveDown();
            } else if(e.key == "w") {
                this.playerTwo.moveUp();
            } else if(e.key == 's') {
                this.playerTwo.moveDown();
            }
        });
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log("x: " + x + "\n" + "y: " + y + "\n");

        });
    }

    private createBoardSideSplit() : void {
        let context = this.context;
        context.beginPath();
        context.moveTo(PongBoard.getCanvasWidth()/2, 0);
        context.lineTo(PongBoard.getCanvasWidth()/2, PongBoard.getCanvasHeight());
        context.stroke();
    }

    public static getCanvasWidth() : number {
        return parseInt(document.getElementById("pong").getAttribute("width"));
    }

    public static getCanvasHeight() : number {
        return parseInt(document.getElementById("pong").getAttribute("height"));
    }

}

class Wall implements Collidable {

    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getCoords(): ItemSize {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }

    public static up(): Wall {
        return new Wall(0, 0, PongBoard.getCanvasWidth(), 1);
    }

    public static right(): Wall {
        return new Wall(PongBoard.getCanvasWidth(), 0, 1, PongBoard.getCanvasHeight());
    }

    public static down(): Wall {
        return new Wall(0, PongBoard.getCanvasHeight(), PongBoard.getCanvasWidth(), 1);
    }

    public static left(): Wall {
        return new Wall(0, 0, 1, PongBoard.getCanvasHeight());
    }
}

interface ItemSize {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Collidable {
    getCoords() : ItemSize;
}

enum BoardSide {
    up,
    right,
    down,
    left
}

class Ball implements Collidable {

    private xPos: number;
    private yPos: number;
    private currAngle: number;
    private ballRadius: number = 10;
    private moveIncrement: number = 1;

    private context : CanvasRenderingContext2D;

    constructor() {
        let canvas = document.getElementById("pong") as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.xPos = PongBoard.getCanvasWidth() / 2;
        this.yPos = PongBoard.getCanvasHeight() / 2;
        this.currAngle = 20;
        context.beginPath();
        context.arc(this.xPos, this.yPos,
            this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
        this.context = context;
    }

    getCoords(): ItemSize {
        return {x: this.xPos - this.ballRadius, y: this.yPos - this.ballRadius, width: this.ballRadius*2+1, height: this.ballRadius*2+1}
    }

    public moveBall() {
        this.clearBall();
        let context = this.context;
        this.xPos += this.moveIncrement * Math.cos(this.currAngle * Math.PI / 180);
        this.yPos += this.moveIncrement * Math.sin(this.currAngle * Math.PI / 180);
        context.beginPath();
        context.arc(this.xPos, this.yPos,
            this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
    }

    public setAngle(angle: number): void {
        //this.moveIncrement = -this.moveIncrement;
        this.currAngle = angle;
    }

    public getAngle(): number {
        return this.currAngle;
    }

    public clearBall(): void {
        let context = this.context;
        context.clearRect(this.xPos - this.ballRadius - 2, this.yPos - this.ballRadius - 1, this.ballRadius*2 + 2, this.ballRadius*2 + 2);
        context.stroke();
    }
}

class Player implements Collidable {
    private yPos: number;
    private xPos: number; // fixed position
    private score: number = 0;
    private context : CanvasRenderingContext2D;

    private paddleWidth: number = 20; // width of the pong paddle(?)
    private paddleHeight: number = 50;
    private paddlePadding: number = 20; // distance from edge of board to paddle
    private moveIncrement: number = 5; // number of pixels to move paddle each call

    constructor(side: BoardSide, isAi: boolean) {
        let canvas = document.getElementById("pong") as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.context = context;
        this.yPos = this.paddlePadding;
        if(side == BoardSide.left) {
            this.xPos = this.paddlePadding;
            context.fillRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight);
            context.stroke();
        } else {
            this.xPos = PongBoard.getCanvasWidth() - this.paddleWidth - this.paddlePadding; // accounts for paddle width
            context.fillRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight);
            context.stroke();
        }
    }

    getCoords(): ItemSize {
        return {x: this.xPos, y: this.yPos, width: this.paddleWidth, height: this.paddleHeight};
    }

    public moveUp() : void {
        if(this.yPos - this.moveIncrement >= this.paddlePadding) {
            this.changeYPosBy(-this.moveIncrement);
        }
    }

    public moveDown() : void {
        if(this.yPos + this.moveIncrement <  (PongBoard.getCanvasHeight() - this.paddleHeight) - this.paddlePadding) {
            this.changeYPosBy(this.moveIncrement);
        }
    }

    public getScore() : number {
        return this.score;
    }

    public setScore(newScore: number): void {
        this.score = newScore;
    }

    private changeYPosBy(yOffset : number) : void {
        let context = this.context;
        context.clearRect(this.xPos, this.yPos, this.paddleWidth, this.paddleHeight); //todo
        context.fillRect(this.xPos, this.yPos + yOffset, this.paddleWidth, this.paddleHeight);
        this.yPos = this.yPos + yOffset;
    }
}


let p = new PongBoard(false, false);