import { Ship } from "../Ship";

export interface TileInterface{
    // combination of row(1-10) and column(A-J)
    id: string;
    // column position
    xPos: number;
    // row position
    yPos: number;
    // ship id
    ship: Ship;
    // flag for if a ship is dragged over the the tile and is a candidate for hosting the ship
    preHasShipFlag: boolean
    // flag for if a tile has ship
    hasShipFlag: boolean;
    // flag for is a tile is already used
    isUsedFlag: boolean;
    // flag for if a ship can be dropped in the tile or not
    isShipDroppableFlag: boolean;
    // flag for if a tile is a neighbor of a tile containing ship
    isNeighborOfShipFlag: boolean;
}