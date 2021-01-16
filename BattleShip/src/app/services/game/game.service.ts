import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/Player';
import { SaveGameInfo } from 'src/app/models/SaveGameInfo';
import { APIMap } from 'src/app/utility/apiMap';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private row: number;
  private col: number;

  // current logged in player
  player: Player;

  constructor(private http: HttpClient) { 
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

  saveGame(saveGameInfo: SaveGameInfo): Observable<boolean>{
    let httpHeader: HttpHeaders = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(APIMap.saveGame, saveGameInfo, {headers: httpHeader}) as Observable<boolean>;
  }
}
