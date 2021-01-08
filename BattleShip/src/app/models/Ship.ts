export class Ship{
    private id: string;
    private name: string;
    private length: number;
    private lives: number;
    private startingIndex: number;
    private horizontalFlag: boolean;
    private notOnBoardFlag: boolean;
    private height: number;
    private width: number;

    constructor(name: string, horizontalFlag?: boolean, id?: string){
        this.name = name;
        this.setLength(name);
        this.lives = this.length;

        if(horizontalFlag != undefined) this.horizontalFlag = horizontalFlag; else this.horizontalFlag = true;

        if(id) this.id = id;
        this.notOnBoardFlag = true;

        if(this.horizontalFlag) {
            this.height = 50;
            this.width = 50 * this.length;
        } else {
            this.width = 50;
            this.height = 50 * this.length;
        }
    }

    setName(name: string): void{
        this.name = name;
    }

    setLength(param: string | number): void{
        if(typeof param === "number") this.length = param;
        else if(typeof param === "string"){
            if(param === "destroyer") this.length = 2;
            else if(param === "cruiser" || param === "submarine") this.length = 3;
            else if(param === "battleship") this.length = 4;
            else if(param === "carrier") this.length = 5;
        }
    }

    setStartingIndex(startingIndex: number): void{
        this.startingIndex = startingIndex;
    }

    setIsHorizontal(horizontalFlag: boolean): void{
        this.horizontalFlag = horizontalFlag;
    }

    getName(): string{
        return this.name;
    }

    getLength(): number{
        return this.length;
    }

    getStartingIndex(): number{
        return this.startingIndex;
    }

    isHorizontal(): boolean{
        return this.horizontalFlag;
    }

    setID(id: string): void{
        this.id = id;
    }

    getID(): string{
        return this.id;
    }

    setNotOnBoardFlag(flag: boolean): void{
        this.notOnBoardFlag = flag;
    }

    getNotOnBoardFlag(): boolean{
        return this.notOnBoardFlag;
    }

    getHeight(): number{
        return this.height;
    }

    getWidth(): number{
        return this.width;
    }

    toggleOrientation(): void{
        this.horizontalFlag = !this.horizontalFlag;
        let temp: number = this.height;
        this.height = this.width;
        this.width = temp;
    }

    setLives(num: number): void{
        this.lives = num;
    }

    getLives(): number{
        return this.lives;
    }
}