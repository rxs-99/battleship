import { Ship } from "./Ship";

export class Tile{
    // combination of row(1-10) and column(A-J)
    private id: string;
    // column position
    private xPos: number;
    // row position
    private yPos: number;
    // ship id
    private ship: Ship;
    // flag for if a ship is dragged over the the tile and is a candidate for hosting the ship
    private preHasShipFlag: boolean
    // flag for if a tile has ship
    private hasShipFlag: boolean;
    // flag for is a tile is already used
    private isUsedFlag: boolean;
    // flag for if a ship can be dropped in the tile or not
    private isShipDroppableFlag: boolean;
    // flag for if a tile is a neighbor of a tile containing ship
    private isNeighborOfShipFlag: boolean;

    tileText: string;

    constructor(id: string, hasShipFlag: boolean, isUsedFlag: boolean, xPos?: number, yPos?: number, ship?: Ship){
        this.id = id;
        this.hasShipFlag = hasShipFlag;
        this.isUsedFlag = isUsedFlag;
        if(xPos >= 0 && yPos >= 0){
            this.xPos = xPos;
            this.yPos = yPos;
        }
        if(ship){
            this.ship = ship;
        }
        this.preHasShipFlag = false;
        this.isShipDroppableFlag = true;
        this.isNeighborOfShipFlag = false;
        this.tileText = "";
    }

    getId(): string{
        return this.id;
    }

    hasShip(): boolean{
        return this.hasShipFlag;
    }

    isUsed(): boolean{
        return this.isUsedFlag;
    }

    setId(id: string): void{
        this.id = id;
    }

    setHasShipFlag(flag: boolean): void{
        this.hasShipFlag = flag;
    }

    setIsUsedFlag(flag: boolean): void{
        this.isUsedFlag = flag;
    }

    getXPos(): number{
        return this.xPos;
    }

    getYPos(): number{
        return this.yPos;
    }

    setXPos(xPos: number): void{
        this.xPos = xPos;
    }

    setYPos(yPos: number): void{
        this.yPos = yPos;
    }

    setShip(ship: Ship): void{
        this.ship = ship;
    }

    getShip(): Ship{
        return this.ship;
    }

    setPreHasShipFlag(flag: boolean): void{
        this.preHasShipFlag = flag;
    }

    getPreHasShipFlag(): boolean{
        return this.preHasShipFlag;
    }

    setPreHasShipFlagAndHasShipFlag(flag1: boolean, flag2: boolean){
        this.preHasShipFlag = flag1;
        this.hasShipFlag = flag2;
    }

    setIsShipDroppable(flag: boolean): void{
        this.isShipDroppableFlag = flag;
    }

    isShipDroppable(): boolean{
        return this.isShipDroppableFlag;
    }

    setIsNeighborOfShipFlag(flag: boolean): void{
        this.isNeighborOfShipFlag = flag;
    }

    isNeighborOfShip(): boolean{
        return this.isNeighborOfShipFlag;
    }
}