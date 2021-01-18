import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game';
import { Ship } from 'src/app/models/Ship';
import { Tile } from 'src/app/models/Tile';
import { BoardService } from 'src/app/services/board/board.service';
import { GameService } from 'src/app/services/game/game.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { GameInfo } from 'src/app/models/interface/GameInfo';
import { TileInfo } from 'src/app/models/interface/TileInfo';
import { ShipInterface } from 'src/app/models/interface/ShipInterface';

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
  aiPrevTile: Tile;
  // ship associated with the aiHitTile
  aiHitShip: Ship;
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

  isLoaded: boolean;

  constructor(private boardService: BoardService, private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.game = new Game();
    // generate boards
    this.game.setBoard1(this.boardService.generateBoard());
    this.game.setBoard2(this.boardService.generateBoard());

    this.shipNames = ["destroyer", "cruiser", "submarine", "battleship", "carrier"];
    this.saveGamePopUpFlag = false;

    this.ships = [];
    this.opponentShips = [];

    this.startFlag = false;

    if (this.gameService.isLoaded) {
      this.isLoaded = true;
      this.setGameInfo(this.gameService.loadedGameInfo);
    } else {
      this.playerOneFlag = false;
      this.playerTwoFlag = true;
      this.turnMessage = "";

      // this.shipNames = ["destroyer", "cruiser", "submarine", "battleship", "carrier"];
      // this.ships = [];
      // this.opponentShips = [];
      this.shipAliveCount = 0;
      this.opponentShipAliveCount = 0;
      this.generateShips();
      // this.startFlag = false;

      // this.game = new Game();

      // // generate boards
      // this.game.setBoard1(this.boardService.generateBoard());
      // this.game.setBoard2(this.boardService.generateBoard());

      this.placeAIShips();
      this.populateAIChooseTiles();

      this.numShipsNotOnBoard = 5;

      this.aiPrevTile = null;
      this.aiHitShip = null;
      this.aiHitShipOrientation = -1;
      this.streak = 1;
      this.resetPredictFlags();
      this.resetPrePredictFlags();

      // this.saveGamePopUpFlag = false;
      this.saveName = "";
      this.isLoaded = false;
    }

    console.log("waiting for to click start");
  }

  start(): void {
    if (!this.isLoaded)
      this.togglePlayerFlag();
    this.isLoaded = false;
    this.startFlag = true;
  }

  onClickTile(tile: Tile): void {
    if (tile.hasShip()) {
      tile.tileText = "O";//tile.setId("O");
      tile.getShip().setLives(tile.getShip().getLives() - 1);
      if (tile.getShip().getLives() === 0) {
        this.opponentShipAliveCount--;
        if (this.opponentShipAliveCount === 0) {
          setTimeout(() => {
            alert("You beat the computer!");
            this.router.navigateByUrl("/body/home");
          }, 250);

        }
      }
    }
    else tile.tileText = "X";//tile.setId("X");
    tile.setIsUsedFlag(true);
    this.togglePlayerFlag();
  }

  togglePlayerFlag(): void {
    this.playerOneFlag = !this.playerOneFlag;
    this.playerTwoFlag = !this.playerTwoFlag;

    this.updateTurnMessage();

    if (this.playerTwoFlag) {
      //this.aiMove();
      timer(0).subscribe(() => {
        this.aiMove();
        this.playerOneFlag = !this.playerOneFlag;
        this.playerTwoFlag = !this.playerTwoFlag;
        this.updateTurnMessage();
      });
    }
  }

  updateTurnMessage(): void {
    if (this.playerOneFlag) this.turnMessage = "Your Turn!";
    else this.turnMessage = "Opponent's turn!";
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

    if (!tile.hasShip() && !tile.isNeighborOfShip()) this.dragDropServiceForTiles("drop", tile);
    this.currentShip = null;
  }

  onDragLeave(ev: Event, tile: Tile): void {
    ev.preventDefault();
    this.dragDropServiceForTiles("leave", tile);

  }

  onDragOver(ev: Event, tile: Tile): void {
    ev.preventDefault();
    if (!tile.hasShip() && !tile.isNeighborOfShip()) {
      this.dragDropServiceForTiles("over", tile);
    }
  }

  dragDropServiceForTiles(event: string, tile: Tile): void {
    let tiles: Tile[][] = this.game.getBoard1().getTiles();
    let tileCount: number = 0;

    // count free tiles in +ve direction
    for (let i = 0; i < this.currentShip.getLength(); i++) {
      let j: number;

      if (this.currentShip.isHorizontal()) {
        j = tile.getXPos() + i;
        if (j > this.gameService.getCol() - 1) break;
        if (tiles[tile.getYPos()][j].hasShip() || tiles[tile.getYPos()][j].isNeighborOfShip()) break;
      } else {
        j = tile.getYPos() + i;
        if (j > this.gameService.getRow() - 1) break;
        if (tiles[j][tile.getXPos()].hasShip() || tiles[j][tile.getXPos()].isNeighborOfShip()) break;
      }

      tileCount++;
    }

    // if enough free tiles in +ve direction
    if (tileCount == this.currentShip.getLength()) {
      let tempTile: Tile;

      for (let i = 0; i < this.currentShip.getLength(); i++) {
        tempTile = this.currentShip.isHorizontal() ? tiles[tile.getYPos()][tile.getXPos() + i] : tiles[tile.getYPos() + i][tile.getXPos()];
        if (event === "drop") {
          tempTile.setPreHasShipFlagAndHasShipFlag(false, true);
          tempTile.setShip(this.currentShip);
        }
        else tempTile.setPreHasShipFlag(event === "over" ? true : false);
      }

      if (event === "drop") {
        this.currentShip.setNotOnBoardFlag(false);
        this.numShipsNotOnBoard--;

        let pLim = !this.currentShip.isHorizontal() ? tile.getYPos() + this.currentShip.getLength() : tile.getYPos() + 1;
        let qLim = this.currentShip.isHorizontal() ? tile.getXPos() + this.currentShip.getLength() : tile.getXPos() + 1;
        for (let p = tile.getYPos() - 1; p <= pLim; p++) {
          for (let q = tile.getXPos() - 1; q <= qLim; q++) {
            if (p >= 0 && p < this.gameService.getRow() && q >= 0 && q < this.gameService.getCol()) {
              tiles[p][q].setIsNeighborOfShipFlag(true);
            }
          }
        }

      }

      // if not enough free tiles in +ve direction, look for tile sin -ve direction
    } else {
      let i: number = 0;
      while (tileCount != this.currentShip.getLength()) {
        i++;
        if (this.currentShip.isHorizontal()) {
          let j: number = tile.getXPos() - i;
          if (j < 0) break;
          if (tiles[tile.getYPos()][j].hasShip() || tiles[tile.getYPos()][j].isNeighborOfShip()) break;
        } else {
          let j: number = tile.getYPos() - i;
          if (j < 0) break;
          if (tiles[j][tile.getXPos()].hasShip() || tiles[j][tile.getXPos()].isNeighborOfShip()) break;
        }
        tileCount++;
      }

      // if enough tiles in both -ve and +ve direction combined
      if (tileCount === this.currentShip.getLength()) {
        let jStart: number = this.currentShip.isHorizontal() ? tile.getXPos() - i : tile.getYPos() - i;
        let jEnd: number = this.currentShip.isHorizontal() ? tile.getXPos() - i + tileCount : tile.getYPos() - i + tileCount;
        for (let j: number = jStart; j < jEnd; j++) {
          let tempTile: Tile = this.currentShip.isHorizontal() ? tiles[tile.getYPos()][j] : tiles[j][tile.getXPos()];
          if (event === "drop") {
            tempTile.setPreHasShipFlagAndHasShipFlag(false, true);
            tempTile.setShip(this.currentShip);
          }
          else tempTile.setPreHasShipFlag(event === "over" ? true : false);
        }

        if (event === "drop") {
          this.currentShip.setNotOnBoardFlag(false);
          this.numShipsNotOnBoard--;

          let pStart: number; let pLim: number; let qStart: number; let qLim: number;
          if (this.currentShip.isHorizontal()) {
            pStart = tile.getYPos();
            qStart = jStart;
            pLim = tile.getYPos() + 1;
            qLim = jStart + this.currentShip.getLength();
          } else {
            pStart = jStart;
            qStart = tile.getXPos();
            pLim = jStart + this.currentShip.getLength();
            qLim = tile.getXPos() + 1
          }

          for (let p = pStart - 1; p <= pLim; p++) {
            for (let q = qStart - 1; q <= qLim; q++) {
              if (p >= 0 && p < this.gameService.getRow() && q >= 0 && q < this.gameService.getCol()) {
                tiles[p][q].setIsNeighborOfShipFlag(true);
              }
            }
          }
        }

        // if not enough tiles to place the ship then
      } else {
        i--;
        while (true) {
          if (this.currentShip.isHorizontal()) {
            if (tile.getXPos() - i >= this.gameService.getCol()) break;
            if (tiles[tile.getYPos()][tile.getXPos() - i].hasShip() || tiles[tile.getYPos()][tile.getXPos() - i].isNeighborOfShip()) break;
            tiles[tile.getYPos()][tile.getXPos() - i].setIsShipDroppable(event === "over" ? false : true);
          } else {
            if (tile.getYPos() - i >= this.gameService.getRow()) break;
            if (tiles[tile.getYPos() - i][tile.getXPos()].hasShip() || tiles[tile.getYPos() - i][tile.getXPos()].isNeighborOfShip()) break;
            tiles[tile.getYPos() - i][tile.getXPos()].setIsShipDroppable(event === "over" ? false : true);
          }
          i--;
        }
      }
    }




    /**    if (this.currentShip.isHorizontal()) {
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
          if (event === "drop") {
            tiles[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlagAndHasShipFlag(false, true);
            tiles[tile.getYPos()][tile.getXPos() + i].setShip(this.currentShip);
          }
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
              tiles[tile.getYPos()][j].setShip(this.currentShip);
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
          if (event === "drop") {
            tiles[tile.getYPos() + i][tile.getXPos()].setPreHasShipFlagAndHasShipFlag(false, true);
            tiles[tile.getYPos() + i][tile.getXPos()].setShip(this.currentShip);
          }
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
              tiles[j][tile.getXPos()].setShip(this.currentShip);
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
    */
  }

  onClickRandomPlace(): void {
    for (let tArr of this.game.getBoard1().getTiles())
      for (let t of tArr) {
        t.setHasShipFlag(false);
        t.setIsNeighborOfShipFlag(false);
        t.setShip(null);
      }

    for (let s of this.ships)
      this.randomShipPlacement(s, this.game.getBoard1().getTiles());
    this.numShipsNotOnBoard = 0;
  }

  randomShipPlacement(s: Ship, tiles: Tile[][]): void {

    let repeatFlag: boolean;

    do {
      // 0 if vertical, 1 if horizontal
      let isHorizontal: number = Math.floor(Math.random() * 2);
      s.setIsHorizontal(isHorizontal ? true : false);

      repeatFlag = false;

      // index for where to start
      let x: number = Math.floor(Math.random() * this.gameService.getCol());
      let y: number = Math.floor(Math.random() * this.gameService.getRow());

      // console.log('checking for: (' + y + ',' + x + ') ');

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
        if (tile.hasShip() || tile.isNeighborOfShip()) {
          repeatFlag = true;
          break;
        }
      }

      if (!repeatFlag) {
        for (let j = 0; j < s.getLength(); j++) {
          if (isHorizontal) tile = tiles[y][x + j]; else tile = tiles[y + j][x];
          tile.setHasShipFlag(true);
          tile.setShip(s);
        }
        s.setNotOnBoardFlag(false);
        // console.log('for starting (' + y + ',' + x + ') ');
        let pLim = !isHorizontal ? y + s.getLength() : y + 1;
        let qLim = isHorizontal ? x + s.getLength() : x + 1;
        for (let p = y - 1; p <= pLim; p++) {
          for (let q = x - 1; q <= qLim; q++) {
            // console.log('(' + p + ',' + q + ') ');
            if (p >= 0 && p < this.gameService.getRow() && q >= 0 && q < this.gameService.getCol()) {
              tiles[p][q].setIsNeighborOfShipFlag(true);
            }
          }
        }

      }

    } while (repeatFlag);

  }

  placeAIShips(): void {
    for (let name of this.shipNames) {
      let s: Ship = new Ship(name);
      this.opponentShips.push(s);
      this.randomShipPlacement(s, this.game.getBoard2().getTiles());
      this.opponentShipAliveCount++;
    }
  }

  populateAIChooseTiles(): void {
    this.aiChooseTiles = new Array<Array<number>>();
    for (let i = 0; i < this.gameService.getRow(); i++) {
      for (let j = 0; j < this.gameService.getCol(); j++) {
        this.aiChooseTiles.push([i, j]);
      }
    }
    // console.log(this.aiChooseTiles);
  }

  aiMoveHelper(direction: string, tiles: Tile[][]): void {
    let d: string = direction;
    let nextTile: Tile;
    let count: number = 0;

    if (d === "up") {
      nextTile = tiles[this.aiPrevTile.getYPos() - 1][this.aiPrevTile.getXPos()];
      if (nextTile.isUsed() && !nextTile.hasShip()) {
        d = "down";
        this.predictFlags[0] = 0;
        this.predictFlags[1] = 1;
      }
    }
    else if (d === "down") {
      nextTile = tiles[this.aiPrevTile.getYPos() + 1][this.aiPrevTile.getXPos()];
      if (nextTile.isUsed() && !nextTile.hasShip()) {
        d = "up";
        this.predictFlags[0] = 1;
        this.predictFlags[1] = 0;
      }
    }
    else if (d === "left") {
      nextTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() - 1];
      if (nextTile.isUsed() && !nextTile.hasShip()) {
        d = "right";
        this.predictFlags[2] = 0;
        this.predictFlags[3] = 1;
      }
    }
    else if (d === "right") {
      nextTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() + 1];
      if (nextTile.isUsed() && !nextTile.hasShip()) {
        d = "left";
        this.predictFlags[2] = 1;
        this.predictFlags[3] = 0;
      }
    }

    do {
      count++;
      if (d === "up")
        nextTile = tiles[this.aiPrevTile.getYPos() - count][this.aiPrevTile.getXPos()];
      else if (d === "down")
        nextTile = tiles[this.aiPrevTile.getYPos() + count][this.aiPrevTile.getXPos()];
      else if (d === "left")
        nextTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() - count];
      else if (d === "right")
        nextTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() + count];

      console.log('checking if tile is used');
      console.log(nextTile)
    } while (nextTile.isUsed());

    nextTile.setIsUsedFlag(true);
    this.aiPrevTile = nextTile;

    if (nextTile.hasShip()) {
      this.aiTileHasShipChore(nextTile);
    } else {
      nextTile.tileText = "X";

      if (d === "up") {
        this.predictFlags[0] = 0;
        this.predictFlags[1] = 1;
        console.log('change direction - up to down');
      }
      else if (d === "down") {
        this.predictFlags[1] = 0;
        this.predictFlags[0] = 1;
        console.log('change direction - down to up');
      }
      else if (d === "left") {
        this.predictFlags[2] = 0;
        this.predictFlags[3] = 1;
        console.log('change direction - left to right');
      }
      else if (d === "right") {
        this.predictFlags[3] = 0;
        this.predictFlags[2] = 1;
        console.log('change direction - right to left');
      }
    }
  }

  aiTileHasShipChore(tile: Tile): void {
    tile.getShip().setLives(tile.getShip().getLives() - 1);
    tile.tileText = "O";
    if (tile.getShip().getLives() === 0) {
      this.aiPrevTile = null;
      this.aiHitShip = null;
      this.shipAliveCount--;
      if (this.shipAliveCount === 0) {
        setTimeout(() => {
          alert("You lost to computer!");
          this.router.navigateByUrl("/body/home");
        }, 250);
      }
    }
  }

  aiMove(): void {
    let tiles: Tile[][] = this.game.getBoard1().getTiles();
    let x: number;
    let y: number;
    let index: number;
    let j: number;

    if (this.aiPrevTile) {
      // up
      if (this.predictFlags[0] === 1) {
        j = this.aiPrevTile.getYPos() - 1;
        if (j >= 0 /*&& !tiles[j][this.aiPrevTile.getXPos()].isUsed()/**/) {
          console.log('ai helper for up');
          this.aiMoveHelper("up", tiles);
        } else {
          console.log('checking y=' + j + ', x=' + this.aiPrevTile.getXPos());
          console.log('change direction - up to down');
          this.predictFlags[0] = 0;
          this.predictFlags[1] = 1;
          this.aiMoveHelper("down", tiles);
        }
      }
      // down
      else if (this.predictFlags[1] === 1) {
        j = this.aiPrevTile.getYPos() + 1;
        if (j < this.gameService.getRow() /*&& !tiles[j][this.aiPrevTile.getXPos()].isUsed()/**/) {
          console.log('ai helper for down');
          this.aiMoveHelper("down", tiles);
        } else {
          console.log('checking y=' + j + ', x=' + this.aiPrevTile.getXPos());
          console.log('change direction - down to up');
          this.predictFlags[0] = 1;
          this.predictFlags[1] = 0;
          this.aiMoveHelper("up", tiles);
        }
      }
      // left
      else if (this.predictFlags[2] === 1) {
        j = this.aiPrevTile.getXPos() - 1;
        if (j >= 0 /*&& !tiles[this.aiPrevTile.getYPos()][j].isUsed()/**/) {
          console.log('ai helper for left');
          this.aiMoveHelper("left", tiles);
        } else {
          console.log('checking y=' + this.aiPrevTile.getYPos() + ', x=' + j);
          console.log('change direction - left to right');
          this.predictFlags[2] = 0;
          this.predictFlags[3] = 1;
          this.aiMoveHelper("right", tiles);
        }
      }
      // right
      else if (this.predictFlags[3] === 1) {
        j = this.aiPrevTile.getXPos() + 1;
        if (j < this.gameService.getCol() /*&& !tiles[this.aiPrevTile.getYPos()][j].isUsed()/**/) {
          console.log('ai helper for right');
          this.aiMoveHelper("right", tiles);
        } else {
          console.log('checking y=' + this.aiPrevTile.getYPos() + ', x=' + j);
          console.log('change direction - right to left');
          this.predictFlags[3] = 0;
          this.predictFlags[2] = 1;
          this.aiMoveHelper("left", tiles);
        }
      }
      // if orientation undecided
      else {
        let randIndex: number;
        let tempTile: Tile;
        let flag: boolean = true;
        let num: number;

        do {
          console.log('prePredictFlags length: ' + this.prePredictFlags.length);

          randIndex = Math.floor(Math.random() * this.prePredictFlags.length);
          num = this.prePredictFlags[randIndex];
          this.prePredictFlags.splice(randIndex, 1);

          if (num === 0 && this.aiPrevTile.getYPos() - 1 >= 0) {
            tempTile = tiles[this.aiPrevTile.getYPos() - 1][this.aiPrevTile.getXPos()];
            if (tempTile.isUsed()) continue;
            tempTile.setIsUsedFlag(true);
            if (tempTile.hasShip()) {
              console.log("go up");
              this.aiPrevTile = tempTile;
              this.predictFlags[0] = 1;
              this.aiTileHasShipChore(tempTile);
            } else {
              tempTile.tileText = "X";
            }
            flag = false;
          } else if (num === 1 && this.aiPrevTile.getYPos() + 1 < this.gameService.getRow()) {
            tempTile = tiles[this.aiPrevTile.getYPos() + 1][this.aiPrevTile.getXPos()];
            if (tempTile.isUsed()) continue;
            tempTile.setIsUsedFlag(true);
            if (tempTile.hasShip()) {
              console.log("go down");
              this.aiPrevTile = tempTile;
              this.predictFlags[1] = 1;
              this.aiTileHasShipChore(tempTile);
            } else {
              tempTile.tileText = "X";
            }
            flag = false;
          } else if (num === 2 && this.aiPrevTile.getXPos() - 1 >= 0) {
            tempTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() - 1];
            if (tempTile.isUsed()) continue;
            tempTile.setIsUsedFlag(true);
            if (tempTile.hasShip()) {
              console.log("go left");
              this.aiPrevTile = tempTile;
              this.predictFlags[2] = 1;
              this.aiTileHasShipChore(tempTile);
            } else {
              tempTile.tileText = "X";
            }
            flag = false;
          } else if (num === 3 && this.aiPrevTile.getXPos() + 1 < this.gameService.getCol()) {
            tempTile = tiles[this.aiPrevTile.getYPos()][this.aiPrevTile.getXPos() + 1];
            if (tempTile.isUsed()) continue;
            tempTile.setIsUsedFlag(true);
            if (tempTile.hasShip()) {
              console.log("go right");
              this.aiPrevTile = tempTile;
              this.predictFlags[3] = 1;
              this.aiTileHasShipChore(tempTile);
            } else {
              tempTile.tileText = "X";
            }
            flag = false;
          }
          // else {
          //   if (this.prePredictFlags[randIndex] === 0) this.predictFlags[0] = 0; 
          //   else if (this.prePredictFlags[randIndex] === 1) this.predictFlags[1] = 0; 
          //   else if (this.prePredictFlags[randIndex] === 2) this.predictFlags[2] = 0; 
          //   else if (this.prePredictFlags[randIndex] === 3) this.predictFlags[3] = 0; 
          // }

        } while (flag);
      }
    } else {
      do {
        // x = Math.floor(Math.random() * this.gameService.getCol());
        // y = Math.floor(Math.random() * this.gameService.getRow());
        // console.log('checking ('+y+','+x+')');
        index = Math.floor(Math.random() * this.aiChooseTiles.length);
        x = this.aiChooseTiles[index][1];
        y = this.aiChooseTiles[index][0];
        this.aiChooseTiles.splice(index, 1);
      } while (tiles[y][x].isUsed());

      // this.aiChooseTiles.splice(index,1);
      // console.log('x= '+x+',y= '+y);

      if (tiles[y][x].hasShip()) {
        this.aiPrevTile = tiles[y][x];
        this.aiHitShip = tiles[y][x].getShip();
        this.resetPredictFlags();
        this.resetPrePredictFlags();
        this.aiHitShip.setLives(this.aiHitShip.getLives() - 1);
        console.log(this.aiHitShip);
        // tiles[y][x].setId("O");
        tiles[y][x].tileText = "O";
      } else {
        // tiles[y][x].setId("X");
        tiles[y][x].tileText = "X";
      }

      tiles[y][x].setIsUsedFlag(true);

    }
    console.log(this.aiPrevTile);
  }

  resetPrePredictFlags(): void {
    this.prePredictFlags = [0, 1, 2, 3];
  }

  resetPredictFlags(): void {
    this.predictFlags = [-1, -1, -1, -1];
  }

  onClickSaveGame(): void {
    console.log("clicked on sae game");
    this.saveGamePopUpFlag = true;
  }

  onSubmitSave(): void {
    console.log("clicked on submit save");

    // let gameInfo: GameInfo = {
    //   playerOneFlag: this.playerOneFlag,
    //   playerTwoFlag: this.playerTwoFlag,
    //   turnMessage: this.turnMessage,
    //   shipNames: this.shipNames,
    //   ships: this.ships,
    //   opponentShips: this.opponentShips,
    //   shipAliveCount: this.shipAliveCount,
    //   opponentShipAliveCount: this.opponentShipAliveCount,
    //   currentShip: this.currentShip,
    //   numShipsNotOnBoard: this.numShipsNotOnBoard,
    //   aiPrevTile: this.aiPrevTile,
    //   aiHitShip: this.aiHitShip,
    //   aiHitShipOrientation: this.aiHitShipOrientation,
    //   predictFlags: this.predictFlags,
    //   prePredictFlags: this.prePredictFlags,
    //   streak: this.streak,
    //   aiChooseTiles: this.aiChooseTiles,
    //   startFlag: this.startFlag,
    //   saveGamePopUpFlag: this.saveGamePopUpFlag,
    //   saveName: this.saveName
    // }

    this.gameService.saveGame({ id: 0, saveName: this.saveName, jsonAsText: JSON.stringify(this.getGameInfo()), timeStamp: null, user: this.gameService.player.userInfo }).subscribe(
      (response) => {
        if (response) {
          this.saveGamePopUpFlag = false;
          this.router.navigateByUrl("/body/home");
        } else {
          console.log("couldn't save. try again!");
        }
      },
      () => { console.log("error saving") }
    );
  }

  getGameInfo(): GameInfo {

    let tileInfo1: TileInfo[][] = new Array<Array<TileInfo>>();
    let tileInfo2: TileInfo[][] = new Array<Array<TileInfo>>();

    let t1: Tile[][] = this.game.getBoard1().getTiles();
    let i: number = 0;
    for (let tArr of t1) {
      tileInfo1.push(new Array<TileInfo>());
      for (let t of tArr) {
        tileInfo1[i].push({
          shipName: t.getShip() ? t.getShip().getName() : null,
          preHasShipFlag: t.getPreHasShipFlag(),
          hasShipFlag: t.hasShip(),
          isUsedFlag: t.isUsed(),
          isShipDroppableFlag: t.isShipDroppable(),
          isNeighborOfShipFlag: t.isNeighborOfShip(),
          tileText: t.tileText
        });
      }
      i++;
    }

    let t2: Tile[][] = this.game.getBoard2().getTiles();
    i = 0;
    for (let tArr of t2) {
      tileInfo2.push(new Array<TileInfo>());
      for (let t of tArr) {
        tileInfo2[i].push({
          shipName: t.getShip() ? t.getShip().getName() : null,
          preHasShipFlag: t.getPreHasShipFlag(),
          hasShipFlag: t.hasShip(),
          isUsedFlag: t.isUsed(),
          isShipDroppableFlag: t.isShipDroppable(),
          isNeighborOfShipFlag: t.isNeighborOfShip(),
          tileText: t.tileText
        });
      }
      i++;
    }

    console.log(this);

    return {
      playerTileInfo: tileInfo1,
      opponentTileInfo: tileInfo2,
      playerOneFlag: this.playerOneFlag,
      playerTwoFlag: this.playerTwoFlag,
      turnMessage: this.turnMessage,
      shipNames: this.shipNames,
      ships: this.ships,
      opponentShips: this.opponentShips,
      shipAliveCount: this.shipAliveCount,
      opponentShipAliveCount: this.opponentShipAliveCount,
      currentShip: this.currentShip,
      numShipsNotOnBoard: this.numShipsNotOnBoard,
      aiPrevTileCoOrdinates: this.aiPrevTile ? [this.aiPrevTile.getYPos(),this.aiPrevTile.getXPos()] : null,
      aiHitShipName: this.aiHitShip ? this.aiHitShip.getName() : null,
      aiHitShipOrientation: this.aiHitShipOrientation,
      predictFlags: this.predictFlags,
      prePredictFlags: this.prePredictFlags,
      streak: this.streak,
      aiChooseTiles: this.aiChooseTiles,
      startFlag: this.startFlag,
      saveGamePopUpFlag: this.saveGamePopUpFlag,
      saveName: this.saveName
    }
  }

  setGameInfo(gameInfo: GameInfo): void {

    console.log("started set game info");

    this.playerOneFlag = gameInfo.playerOneFlag;
    this.playerTwoFlag = gameInfo.playerTwoFlag
    this.turnMessage = gameInfo.turnMessage;

    this.shipAliveCount = gameInfo.shipAliveCount;
    this.opponentShipAliveCount = gameInfo.opponentShipAliveCount;

    this.numShipsNotOnBoard = gameInfo.numShipsNotOnBoard;

    this.aiHitShipOrientation = gameInfo.aiHitShipOrientation;
    this.predictFlags = gameInfo.predictFlags;
    this.prePredictFlags = gameInfo.prePredictFlags;
    this.streak = gameInfo.streak;
    this.aiChooseTiles = gameInfo.aiChooseTiles;
    this.saveName = gameInfo.saveName;

    // this.ships = gameInfo.ships;
    // this.opponentShips = gameInfo.opponentShips;

    console.log("before set ship");

    for(let i = 0; i < gameInfo.ships.length; i++){
      this.ships.push(Object.assign(new Ship(),gameInfo.ships[i]));
    }

    for(let i = 0; i < gameInfo.opponentShips.length; i++){
      this.opponentShips.push(Object.assign(new Ship(),gameInfo.opponentShips[i]));
    }

    console.log("after set ship");
    
    let playerBoardTiles: Tile[][] = this.game.getBoard1().getTiles();
    for (let i = 0; i < playerBoardTiles.length; i++) {
      for (let j = 0; j < playerBoardTiles[0].length; j++) {
        playerBoardTiles[i][j].setPreHasShipFlag(gameInfo.playerTileInfo[i][j].preHasShipFlag);
        playerBoardTiles[i][j].setHasShipFlag(gameInfo.playerTileInfo[i][j].hasShipFlag);
        playerBoardTiles[i][j].setIsUsedFlag(gameInfo.playerTileInfo[i][j].isUsedFlag);
        playerBoardTiles[i][j].setIsShipDroppable(gameInfo.playerTileInfo[i][j].isShipDroppableFlag);
        playerBoardTiles[i][j].setIsNeighborOfShipFlag(gameInfo.playerTileInfo[i][j].isNeighborOfShipFlag);
        playerBoardTiles[i][j].tileText = gameInfo.playerTileInfo[i][j].tileText;
        playerBoardTiles[i][j].setShip(this.ships[this.getShipIndex(gameInfo.playerTileInfo[i][j].shipName)]);
      }
    }

    let opponentBoardTiles: Tile[][] = this.game.getBoard2().getTiles();
    for (let i = 0; i < opponentBoardTiles.length; i++) {
      for (let j = 0; j < opponentBoardTiles[0].length; j++) {
        opponentBoardTiles[i][j].setPreHasShipFlag(gameInfo.opponentTileInfo[i][j].preHasShipFlag);
        opponentBoardTiles[i][j].setHasShipFlag(gameInfo.opponentTileInfo[i][j].hasShipFlag);
        opponentBoardTiles[i][j].setIsUsedFlag(gameInfo.opponentTileInfo[i][j].isUsedFlag);
        opponentBoardTiles[i][j].setIsShipDroppable(gameInfo.opponentTileInfo[i][j].isShipDroppableFlag);
        opponentBoardTiles[i][j].setIsNeighborOfShipFlag(gameInfo.opponentTileInfo[i][j].isNeighborOfShipFlag);
        opponentBoardTiles[i][j].tileText = gameInfo.opponentTileInfo[i][j].tileText;
        opponentBoardTiles[i][j].setShip(this.opponentShips[this.getShipIndex(gameInfo.opponentTileInfo[i][j].shipName)]);
      }
    }

    this.aiPrevTile = gameInfo.aiPrevTileCoOrdinates ? playerBoardTiles[gameInfo.aiPrevTileCoOrdinates[0]][gameInfo.aiPrevTileCoOrdinates[1]] : null;
    this.aiHitShip = gameInfo.aiHitShipName ? this.ships[this.getShipIndex(gameInfo.aiHitShipName)] : null;

    console.log("finished set game info");

    console.log(this);
  }

  getShipIndex(name: string): number {
    if (name === 'destroyer') return 0;
    else if (name === 'cruiser') return 1;
    else if (name === 'submarine') return 2;
    else if (name === 'battleship') return 3;
    else if (name === 'carrier') return 4;
  }

  // setFields(gameInfo: GameInfo) {
  //   this.game = gameInfo.game;
  //   this.playerOneFlag = gameInfo.playerOneFlag;
  //   this.playerTwoFlag = gameInfo.playerTwoFlag;
  //   this.turnMessage = gameInfo.turnMessage;
  //   this.shipNames = gameInfo.shipNames;
  //   this.ships = gameInfo.ships;
  //   this.opponentShips = gameInfo.opponentShips;
  //   this.shipAliveCount = gameInfo.shipAliveCount;
  //   this.opponentShipAliveCount = gameInfo.opponentShipAliveCount;
  //   this.currentShip = gameInfo.currentShip;
  //   this.numShipsNotOnBoard = gameInfo.numShipsNotOnBoard;
  //   this.aiPrevTile = gameInfo.aiPrevTile;
  //   this.aiHitShip = gameInfo.aiHitShip;
  //   this.aiHitShipOrientation = gameInfo.aiHitShipOrientation;
  //   this.predictFlags = gameInfo.predictFlags;
  //   this.prePredictFlags = gameInfo.prePredictFlags;
  //   this.streak = gameInfo.streak;
  //   this.aiChooseTiles = gameInfo.aiChooseTiles;
  //   this.startFlag = gameInfo.startFlag;
  //   this.saveGamePopUpFlag = gameInfo.saveGamePopUpFlag;
  //   this.saveName = gameInfo.saveName;
  // }
}
