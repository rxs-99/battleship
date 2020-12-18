import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-board-one',
  templateUrl: './board-one.component.html',
  styleUrls: ['../game.component.css','./board-one.component.css']
})
export class BoardOneComponent implements OnInit {

  row: number;
  col: number;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.row = this.gameService.getRow();
    this.col = this.gameService.getCol();
  }

}
