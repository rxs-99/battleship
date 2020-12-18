import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu: string[] = [];

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.menu.push("New Game");
    this.menu.push("Load Game");
    this.menu.push("Toggle Sound");
  }

  onClick(menuOption: string): void{
    if(menuOption === "New Game"){
      this.gameService.setRow(10);
      this.gameService.setCol(10);
      this.router.navigateByUrl("/body/game");
    }
    else if(menuOption === "Load Game")
      console.log("TODO -- " + menuOption);
    else if(menuOption === "Toggle Sound")
      console.log("TODO -- " + menuOption);
  }

}
