import { Board } from "./Board";

export class Game{
    private id: number;
    private board1: Board;
    private board2: Board;

    constructor(id?: number, board1?: Board, board2?: Board){
        if(id)
            this.id = id;
        
        if(board1 && board2){
            this.board1 = board1;
            this.board2 = board2;
        } else {
            this.board1 = new Board();
            this.board2 = new Board();
        }
    }

    setBoard1(board: Board): void{
        this.board1 = board;
    }

    setBoard2(board: Board): void{
        this.board2 = board;
    }

    getBoard1(): Board{
        return this.board1;
    }

    getBoard2(): Board{
        return this.board2;
    }

    setId(id: number): void{
        this.id = id;
    }

    getId(): number{
        return this.id;
    }
}