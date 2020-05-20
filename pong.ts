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
        (function ballLoop(counter){
            console.log(counter);
            console.log(_this.isColliding(theBall, _this.playerOne));
            theBall.moveBall();
            setTimeout(ballLoop,0,counter + 1);
        })(0);
    }

    private isColliding(a: Collidable, b: Collidable): boolean {
        let aCoords : number[] = a.getCollisionCoords();
        let bCoords : number[] = b.getCollisionCoords();

        return true;
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

interface Collidable {
    getCollisionCoords() : number[];
}

enum BoardSide {
    left,
    right
}

class Ball implements Collidable {

    private xPos: number;
    private yPos: number;
    private currAngle: number;
    private ballRadius: number = 10;
    private moveIncrement: number = .25;

    private context : CanvasRenderingContext2D;

    constructor() {
        let canvas = document.getElementById("pong") as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.xPos = PongBoard.getCanvasWidth() / 2;
        this.yPos = PongBoard.getCanvasHeight() / 2;
        context.beginPath();
        context.arc(this.xPos, this.yPos,
            this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
        this.context = context;
    }

    getCollisionCoords(): number[] {
        throw new Error("Method not implemented.");
    }

    public moveBall() {
        let context = this.context;
        context.clearRect(this.xPos - this.ballRadius-1, this.yPos - this.ballRadius-1, this.ballRadius*2, this.ballRadius*2);
        this.xPos += this.moveIncrement;
        context.beginPath();
        context.arc(this.xPos, this.yPos,
            this.ballRadius, 0, 2 * Math.PI);
        context.stroke();
    }
}

class Player implements Collidable {
    private yPos: number;
    private xPos: number; // fixed position
    private score: number;
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

    getCollisionCoords(): number[] {
        return [this.xPos, this.xPos + this.paddleWidth, this.yPos, this.yPos + this.paddleHeight];
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

    private changeYPosBy(yOffset : number) : void {
        let context = this.context;
        context.clearRect(this.xPos, this.paddlePadding, this.paddleWidth, 1200);
        context.fillRect(this.xPos, this.yPos + yOffset, this.paddleWidth, this.paddleHeight);
        this.yPos = this.yPos + yOffset;
    }
}

let p = new PongBoard(false, false);