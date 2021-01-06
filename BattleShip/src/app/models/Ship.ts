export class Ship{
    private id: string;
    private name: string;
    private length: number;
    private startingIndex: number;
    private horizontalFlag: boolean;
    private notOnBoardFlag: boolean;

    constructor(name: string, horizontalFlag?: boolean, id?: string){
        this.name = name;
        this.setLength(name);

        if(horizontalFlag) this.horizontalFlag = horizontalFlag; else this.horizontalFlag = true;

        if(id) this.id = id;
        this.notOnBoardFlag = true;
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
}