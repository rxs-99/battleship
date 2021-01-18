import { Game } from "../Game";
import { Ship } from "../Ship";
import { Tile } from "../Tile";
import { TileInfo } from "./TileInfo";

export interface GameInfo {

    // game info
    playerTileInfo: TileInfo[][];
    opponentTileInfo: TileInfo[][];

    // player one's turn flag
    playerOneFlag: boolean;
    // player two's turn flag
    playerTwoFlag: boolean;
    // string variable that holds the message for which player's turn it is
    turnMessage: string;

    // name of ships
    shipNames: string[];
    // ships in player's board
    ships: Ship[];
    opponentShips: Ship[];
    // # of ships not sunk
    shipAliveCount: number;
    opponentShipAliveCount: number;

    // for drag-drop
    // current ship being dragged
    currentShip: Ship;
    // number of ships not on board
    numShipsNotOnBoard: number;

    // for AI's move
    // tile of a ship that is hit first by the AI
    aiPrevTileCoOrdinates: number[];
    // ship associated with the aiHitTile
    aiHitShipName: string;
    // ship orientation -- 0 for vertical, 1 for horizontal
    aiHitShipOrientation: number;
    // if hit tile, tells the ai its next move based on tiles hit
    // 0 if false, 1 if true, -1 if undecided
    // up,down,left,right respectively starting form index 0
    predictFlags: number[];
    // helps to determine the orientation
    // same as above, value of 0, 1, 2, 3 represent up, down, left, right respectively
    prePredictFlags: number[];
    // hit streak on a particular direction
    streak: number;
    // all possible tile indices to choose from
    aiChooseTiles: number[][];


    // flag for when the user presses start button to start the game after placing the ships
    startFlag: boolean;

    saveGamePopUpFlag: boolean;
    saveName: string;
}