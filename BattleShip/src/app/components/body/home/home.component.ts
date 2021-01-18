import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveGameInfoByUser } from 'src/app/models/interface/SaveGameInfoByUser';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu: string[];
  loadGamePopUp: boolean;
  menuButtonsDisableFlags: number[];

  savedGamesInfoList: SaveGameInfoByUser[];

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.menu = ["New Game", "Load Game", "Toggle Sound"];
    this.menuButtonsDisableFlags = [0,0,0];
    this.loadGamePopUp = false;
  }

  onClick(menuOption: string): void{
    if(menuOption === "New Game"){
      this.gameService.setRow(10);
      this.gameService.setCol(10);
      this.router.navigateByUrl("/body/game");
    }
    else if(menuOption === "Load Game"){
      this.menuButtonsDisableFlags[1] = 1;
      this.gameService.getSaveGameInfoByUserId().subscribe(
        (response) => {
          this.menuButtonsDisableFlags[1] = 0;
          this.savedGamesInfoList = response;
        },
        () => { 
          this.menuButtonsDisableFlags[1] = 0;
          console.log("error fetching data"); 
        }
        
      );
      this.loadGamePopUp = true;
    }
    else if(menuOption === "Toggle Sound")
      console.log("TODO -- " + menuOption);
  }

  onClickLoadSaveGame(info: SaveGameInfoByUser): void {
    this.gameService.getSaveGame(info.saveName).subscribe(
      (response) => {
        if(response){
          this.gameService.loadedGameInfo = response;
          this.gameService.isLoaded = true;
          this.router.navigateByUrl("/body/game");
        } else {
          console.log("nothing to load");
        }
      },
      () => { console.log("error fetching data"); }
    );
  }

}
