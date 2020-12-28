export class Tile{
    id: string;
    hasShipFlag: boolean;
    isUsedFlag: boolean;

    constructor(id: string, hasShipFlag: boolean, isUsedFlag: boolean){
        this.id = id;
        this.hasShipFlag = hasShipFlag;
        this.isUsedFlag = isUsedFlag;
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
}