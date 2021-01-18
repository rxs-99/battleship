import { ShipInterface } from "./interface/ShipInterface";

export class Ship {
    private id: string;
    private name: string;
    private length: number;
    private lives: number;
    private startingIndex: number[];
    private horizontalFlag: boolean;
    private notOnBoardFlag: boolean;
    private height: number;
    private width: number;

    constructor(name?: string, horizontalFlag?: boolean, id?: string, length?: number, lives?: number, startingIndex?: number[], notOnBoardFlag?: boolean, height?: number, width?: number) {
        this.name = name ? name : "";

        this.id = id ? id : this.name;

        this.setLength(name);

        this.lives = lives ? lives : this.length;

        this.horizontalFlag = (horizontalFlag != undefined) ? horizontalFlag : true;

        this.id = id ? id : "";

        this.startingIndex = startingIndex ? startingIndex : null;

        this.notOnBoardFlag = notOnBoardFlag == undefined ? true : notOnBoardFlag;

        if (width != undefined && height != undefined) {
            this.width = width;
            this.height = height;
        } else {
            if (this.horizontalFlag) {
                this.height = 50;
                this.width = 50 * this.length;
            } else {
                this.width = 50;
                this.height = 50 * this.length;
            }
        }
    }

    setName(name: string): void {
        this.name = name;
    }

    setLength(param: string | number): void {
        if (typeof param === "number") this.length = param;
        else if (typeof param === "string") {
            if (param === "destroyer") this.length = 2;
            else if (param === "cruiser" || param === "submarine") this.length = 3;
            else if (param === "battleship") this.length = 4;
            else if (param === "carrier") this.length = 5;
        }
    }

    setStartingIndex(startingIndex: number[]): void {
        this.startingIndex = startingIndex;
    }

    setIsHorizontal(horizontalFlag: boolean): void {
        this.horizontalFlag = horizontalFlag;
    }

    getName(): string {
        return this.name;
    }

    getLength(): number {
        return this.length;
    }

    getStartingIndex(): number[] {
        return this.startingIndex;
    }

    isHorizontal(): boolean {
        return this.horizontalFlag;
    }

    setID(id: string): void {
        this.id = id;
    }

    getID(): string {
        return this.id;
    }

    setNotOnBoardFlag(flag: boolean): void {
        this.notOnBoardFlag = flag;
    }

    getNotOnBoardFlag(): boolean {
        return this.notOnBoardFlag;
    }

    getHeight(): number {
        return this.height;
    }

    getWidth(): number {
        return this.width;
    }

    toggleOrientation(): void {
        this.horizontalFlag = !this.horizontalFlag;
        let temp: number = this.height;
        this.height = this.width;
        this.width = temp;
    }

    setLives(num: number): void {
        this.lives = num;
    }

    getLives(): number {
        return this.lives;
    }

    // serialize(): ShipInterface {
    //     return {
    //         id: this.id,
    //         name: this.name,
    //         length: this.length,
    //         lives: this.lives,
    //         startingIndex: this.startingIndex,
    //         horizontalFlag: this.horizontalFlag,
    //         notOnBoardFlag: this.notOnBoardFlag,
    //         height: this.height,
    //         width: this.width
    //     }
    // }

    // deserialize(info: ShipInterface): void {
    //     this.id = info.id;
    //     this.name = info.name;
    //     this.length = info.length;
    //     this.lives = info.lives;
    //     this.startingIndex = info.startingIndex;
    //     this.horizontalFlag = info.horizontalFlag;
    //     this.notOnBoardFlag = info.notOnBoardFlag;
    //     this.height = info.height;
    //     this.width = info.width;

    // }
}