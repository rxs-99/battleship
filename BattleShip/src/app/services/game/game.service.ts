import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameInfo } from 'src/app/models/GameInfo';
import { Player } from 'src/app/models/Player';
import { SaveGameInfo } from 'src/app/models/SaveGameInfo';
import { SaveGameInfoByUser } from 'src/app/models/SaveGameInfoByUser';
import { APIMap } from 'src/app/utility/apiMap';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private row: number;
  private col: number;

  // current logged in player
  player: Player;

  isLoaded: boolean;

  loadedGameInfo: GameInfo;

  constructor(private http: HttpClient) { 
    this.row = 10;
    this.col = 10;

    this.isLoaded = false;
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

  getSaveGameInfoByUserId(): Observable<SaveGameInfoByUser[]>{
    return this.http.get(APIMap.loadSaveGameNamesByUserId+this.player.userInfo.id) as Observable<SaveGameInfoByUser[]>;
  }

  getSaveGame(saveName: string): Observable<GameInfo>{
    return this.http.get(APIMap.getSaveGame + this.player.userInfo.id + "/" + saveName) as Observable<GameInfo>;
  }
}
