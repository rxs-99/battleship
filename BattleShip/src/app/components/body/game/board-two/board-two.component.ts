import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-board-two',
  templateUrl: './board-two.component.html',
  styleUrls: ['../game.component.css','./board-two.component.css']
})
export class BoardTwoComponent implements OnInit {

  row: number;
  col: number;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.row = this.gameService.getRow();
    this.col = this.gameService.getCol();
  }

}
