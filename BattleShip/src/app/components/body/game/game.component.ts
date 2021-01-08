import { Component, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Board } from 'src/app/models/Board';
import { Game } from 'src/app/models/Game';
import { Player } from 'src/app/models/Player';
import { Ship } from 'src/app/models/Ship';
import { Tile } from 'src/app/models/Tile';
import { BoardService } from 'src/app/services/board/board.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // current game
  game: Game;

  // player one's turn flag
  playerOneFlag: boolean;
  // player two's turn flag
  playerTwoFlag: boolean;

  // name of ships
  shipNames: string[];
  // ships in player's board
  ships: Ship[];
  // # of ships not sunk
  shipAliveCount: number;

  // for drag-drop
  // current ship being dragged
  currentShip: Ship;
  // number of ships not on board
  numShipsNotOnBoard: number;

  // for AI's move
  // tile of a ship that is hit first by the AI
  aiHitTile: Tile;
  // ship associated with the aiHitTile
  aiHitShip: Ship;


  // flag for when the user presses start button to start the game after placing the ships
  startFlag: boolean;

  constructor(private boardService: BoardService, private gameService: GameService) { }

  ngOnInit(): void {
    this.playerOneFlag = false;
    this.playerTwoFlag = true;

    this.shipNames = ["destroyer", "cruiser", "submarine", "battleship", "carrier"];
    this.ships = [];
    this.shipAliveCount = 0;
    this.generateShips();
    this.startFlag = false;

    this.game = new Game();

    // generate boards
    this.game.setBoard1(this.boardService.generateBoard());
    this.game.setBoard2(this.boardService.generateBoard());

    this.placeAIShips();

    this.numShipsNotOnBoard = 5;

    this.aiHitTile = null;
    this.aiHitShip = null;
  }

  start(): void {
    this.togglePlayerFlag();
    this.startFlag = true;
  }

  onClickTile(tile: Tile): void {
    if(tile.hasShip()) tile.setId("O");
    else tile.setId("X");
    tile.setIsUsedFlag(true);
    this.togglePlayerFlag();
  }

  togglePlayerFlag(): void {
    this.playerOneFlag = !this.playerOneFlag;
    this.playerTwoFlag = !this.playerTwoFlag;

    if(this.playerTwoFlag){
      this.aiMove();
      this.playerOneFlag = !this.playerOneFlag;
      this.playerTwoFlag = !this.playerTwoFlag;
    }
  }

  generateShips(): void {
    for (let shipName of this.shipNames) {
      this.ships.push(new Ship(shipName, true));
      this.shipAliveCount++;
    }
  }

  onDragStart(s: Ship): void {
    this.currentShip = s;
  }

  onDrop(ev: Event, tile: Tile): void {
    ev.preventDefault();

    if (!tile.hasShip()) this.dragDropServiceForTiles("drop", tile);
    this.currentShip = null;
  }

  onDragLeave(ev: Event, tile: Tile): void {
    ev.preventDefault();
    this.dragDropServiceForTiles("leave", tile);

  }

  onDragOver(ev: Event, tile: Tile): void {
    ev.preventDefault();
    if (!tile.hasShip()) {
      this.dragDropServiceForTiles("over", tile);
    }
  }

  dragDropServiceForTiles(event: string, tile: Tile): void {
    let tiles: Tile[][] = this.game.getBoard1().getTiles();
    let tileCount: number = 0;

    if (this.currentShip.isHorizontal()) {
      // count free tiles in +ve direction
      for (let i = 0; i < this.currentShip.getLength(); i++) {
        let j: number = tile.getXPos() + i;

        if (j > this.gameService.getCol() - 1) break;
        if (tiles[tile.getYPos()][j].hasShip()) break;
        tileCount++;
      }
      // if enough free tiles in +ve direction
      if (tileCount == this.currentShip.getLength()) {
        for (let i = 0; i < this.currentShip.getLength(); i++) {
          if (event === "drop") tiles[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlagAndHasShipFlag(false, true);
          else tiles[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlag(event === "over" ? true : false);
        }

        if (event === "drop") {
          this.currentShip.setNotOnBoardFlag(false);
          this.numShipsNotOnBoard--;
        }

        // if not enough free tiles in +ve direction, look for tile sin -ve direction
      } else {
        let i: number = 0;
        while (tileCount != this.currentShip.getLength()) {
          i++;
          let j: number = tile.getXPos() - i;
          if (j < 0) break;
          if (tiles[tile.getYPos()][j].hasShip()) break;
          tileCount++;
        }

        // if enough tiles in both -ve and +ve direction combined
        if (tileCount === this.currentShip.getLength()) {
          for (let j: number = tile.getXPos() - i; j < tile.getXPos() - i + tileCount; j++) {
            // tiles[tile.getYPos()][j].setPreHasShipFlag(true);
            if (event === "drop") {
              tiles[tile.getYPos()][j].setPreHasShipFlagAndHasShipFlag(false, true);
            }
            else tiles[tile.getYPos()][j].setPreHasShipFlag(event === "over" ? true : false);
          }

          if (event === "drop") {
            this.currentShip.setNotOnBoardFlag(false);
            this.numShipsNotOnBoard--;
          }

          // if not enough tiles to place the ship then
        } else {
          i--;
          while (true) {
            if (tile.getXPos() - i >= this.gameService.getCol()) break;
            if (tiles[tile.getYPos()][tile.getXPos() - i].hasShip()) break;
            tiles[tile.getYPos()][tile.getXPos() - i].setIsShipDroppable(event === "over" ? false : true);
            i--;
          }
        }
      }

      // if (tile.getXPos() + this.currentShip.getLength() > this.gameService.getCol()) {
      //   for (let i = tile.getXPos(); i < this.gameService.getCol(); i++) {
      //     if (event === "drop") this.game.getBoard1().getTiles()[tile.getYPos()][i].setPreHasShipFlagAndHasShipFlag(false, true);
      //     else this.game.getBoard1().getTiles()[tile.getYPos()][i].setPreHasShipFlag(event === "over" ? true : false);
      //   }
      //   for (let i = 1; i <= this.currentShip.getLength() - this.gameService.getCol() + tile.getXPos(); i++) {
      //     if (event === "drop") this.game.getBoard1().getTiles()[tile.getYPos()][tile.getXPos() - i].setPreHasShipFlagAndHasShipFlag(false, true);
      //     else this.game.getBoard1().getTiles()[tile.getYPos()][tile.getXPos() - i].setPreHasShipFlag(event === "over" ? true : false);
      //   }
      // } else {
      //   for (let i = 0; i < this.currentShip.getLength(); i++) {
      //     if (event === "drop") this.game.getBoard1().getTiles()[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlagAndHasShipFlag(false, true);
      //     else this.game.getBoard1().getTiles()[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlag(event === "over" ? true : false);
      //   }
      // }
    } else {




      // count free tiles in +ve direction
      for (let i = 0; i < this.currentShip.getLength(); i++) {
        let j: number = tile.getYPos() + i;

        if (j > this.gameService.getRow() - 1) break;
        if (tiles[j][tile.getXPos()].hasShip()) break;
        tileCount++;
      }
      // if enough free tiles in +ve direction
      if (tileCount == this.currentShip.getLength()) {
        for (let i = 0; i < this.currentShip.getLength(); i++) {
          if (event === "drop") tiles[tile.getYPos() + i][tile.getXPos()].setPreHasShipFlagAndHasShipFlag(false, true);
          else tiles[tile.getYPos() + i][tile.getXPos()].setPreHasShipFlag(event === "over" ? true : false);
        }

        if (event === "drop") {
          this.currentShip.setNotOnBoardFlag(false);
          this.numShipsNotOnBoard--;
        }

        // if not enough free tiles in +ve direction, look for tile sin -ve direction
      } else {
        let i: number = 0;
        while (tileCount != this.currentShip.getLength()) {
          i++;
          let j: number = tile.getYPos() - i;
          if (j < 0) break;
          if (tiles[j][tile.getXPos()].hasShip()) break;
          tileCount++;
        }

        // if enough tiles in both -ve and +ve direction combined
        if (tileCount === this.currentShip.getLength()) {
          for (let j: number = tile.getYPos() - i; j < tile.getYPos() - i + tileCount; j++) {
            // tiles[tile.getYPos()][j].setPreHasShipFlag(true);
            if (event === "drop") {
              tiles[j][tile.getXPos()].setPreHasShipFlagAndHasShipFlag(false, true);
            }
            else tiles[j][tile.getXPos()].setPreHasShipFlag(event === "over" ? true : false);
          }

          if (event === "drop") {
            this.currentShip.setNotOnBoardFlag(false);
            this.numShipsNotOnBoard--;
          }

          // if not enough tiles to place the ship then
        } else {
          i--;
          while (true) {
            if (tile.getYPos() - i >= this.gameService.getRow()) break;
            if (tiles[tile.getYPos() - i][tile.getXPos()].hasShip()) break;
            tiles[tile.getYPos() - i][tile.getXPos()].setIsShipDroppable(event === "over" ? false : true);
            i--;
          }
        }
      }

    }
  }

  onClickRandomPlace(): void {
    for (let tArr of this.game.getBoard1().getTiles())
      for (let t of tArr)
        t.setHasShipFlag(false);

    for (let s of this.ships)
      this.randomShipPlacement(s, this.game.getBoard1().getTiles());
    this.numShipsNotOnBoard = 0;
  }

  randomShipPlacement(s: Ship, tiles: Tile[][]): void {

    // 0 if vertical, 1 if horizontal
    let isHorizontal: number = Math.floor(Math.random() * 2);
    s.setIsHorizontal(isHorizontal ? true : false);

    let repeatFlag: boolean;

    do {
      repeatFlag = false;

      // index for where to start
      let x: number = Math.floor(Math.random() * this.gameService.getCol());
      let y: number = Math.floor(Math.random() * this.gameService.getRow());

      let tile: Tile;

      for (let j = 0; j < s.getLength(); j++) {
        if (isHorizontal) {
          if (x + j > this.gameService.getCol() - 1) {
            repeatFlag = true;
            break;
          }
          tile = tiles[y][x + j];
        }
        else {
          if (y + j > this.gameService.getRow() - 1) {
            repeatFlag = true;
            break;
          }
          tile = tiles[y + j][x];
        }
        if (tile.hasShip()) {
          repeatFlag = true;
          break;
        }
      }

      if (!repeatFlag) {
        for (let j = 0; j < s.getLength(); j++) {
          if (isHorizontal) tile = tiles[y][x + j]; else tile = tiles[y + j][x];
          tile.setHasShipFlag(true);
        }
        s.setNotOnBoardFlag(false);
      }

    } while (repeatFlag);

  }

  placeAIShips(): void{
    for(let name of this.shipNames){
      let s: Ship = new Ship(name);
      this.randomShipPlacement(s,this.game.getBoard2().getTiles());
    }
  }

  aiMove(): void{
    console.log("in");
    let tiles: Tile[][] = this.game.getBoard1().getTiles();
    let x: number;
    let y: number;
    do{
      x = Math.floor(Math.random() * this.gameService.getCol());
      y = Math.floor(Math.random() * this.gameService.getRow());
    } while(tiles[y][x].isUsed());

    if(tiles[y][x].hasShip()) {
      tiles[y][x].setId("O");
    }
    else {
      tiles[y][x].setId("X");
    }

    tiles[y][x].setIsUsedFlag(true);
  }
}
