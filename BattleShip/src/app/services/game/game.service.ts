import { Injectable } from '@angular/core';
import { Player } from 'src/app/models/Player';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private row: number;
  private col: number;

  // current logged in player
  player: Player;

  constructor() { 
    this.row = 10;
    this.col = 10;
  }

  setRow(row: number): void{
    this.row = row;
  }

  setCol(col: number): void{
    this.col = col;
  }

  getRow(): number{
    return this.row;
  }

  getCol(): number{
    return this.col;
  }

  // one the player logs in, set the logged in player
  setPlayer(player: Player){
    this.player = player;
  }
}
