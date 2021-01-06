import { Component, OnInit } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
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

  constructor(private boardService: BoardService, private gameService: GameService) { }

  ngOnInit(): void {
    this.playerOneFlag = false;
    this.playerTwoFlag = true;

    this.shipNames = ["destroyer", "cruiser", "submarine", "battleship", "carrier"];
    this.ships = [];
    this.shipAliveCount = 0;
    this.generateShips();

    this.game = new Game();

    // generate boards
    this.game.setBoard1(this.boardService.generateBoard());
    this.game.setBoard2(this.boardService.generateBoard());

    this.numShipsNotOnBoard = 5;
  }

  start(): void {
    this.togglePlayerFlag();    
  }

  onClickTile(tile: Tile): void {
    tile.setId("X");
    tile.setIsUsedFlag(true);
    this.togglePlayerFlag();
  }

  togglePlayerFlag(): void {
    this.playerOneFlag = !this.playerOneFlag;
    this.playerTwoFlag = !this.playerTwoFlag;
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
    console.log(this.numShipsNotOnBoard);
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
        if (j < this.gameService.getCol())
          if (!tiles[tile.getYPos()][j].hasShip())
            tileCount++;
      }
      // if enough free tiles in +ve direction
      if (tileCount == this.currentShip.getLength()) {
        for (let i = 0; i < this.currentShip.getLength(); i++) {
          if (event === "drop") tiles[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlagAndHasShipFlag(false, true);
          else tiles[tile.getYPos()][tile.getXPos() + i].setPreHasShipFlag(event === "over" ? true : false);
        }

        if(event === "drop"){
          this.currentShip.setNotOnBoardFlag(false);
            this.numShipsNotOnBoard--;
        }

        // if not enough free tiles in +ve direction, look for tile sin -ve direction
      } else {
        let i: number = 0;
        while (tileCount != this.currentShip.getLength()) {
          i++;
          let j: number = tile.getXPos() - i;
          if (j < 0)
            break;
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

          if(event === "drop"){
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



      // TODO
    }
  }
}
