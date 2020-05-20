class PongBoard {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private playerOne: Player;
    private playerTwo: Player;

    constructor(playerOneIsAI: boolean, playerTwoIsAI: boolean) {
        let canvas = document.getElementById("pong") as HTMLCanvasElement;
        let context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;

        this.playerOne = new Player(BoardSide.left, playerOneIsAI);
        this.playerTwo = new Player(BoardSide.right, playerTwoIsAI);
        this.addPlayerMovement();
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

    public static getCanvasWidth() : number {
        return parseInt(document.getElementById("pong").getAttribute("width"));
    }

    public static getCanvasHeight() : number {
        return parseInt(document.getElementById("pong").getAttribute("height"));
    }

}

enum BoardSide {
    left,
    right
}

class Player {
    private yPos: number;
    private xPos: number; // fixed position
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