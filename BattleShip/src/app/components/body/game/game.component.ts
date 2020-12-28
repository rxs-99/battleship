import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game';
import { Player } from 'src/app/models/Player';
import { BoardService } from 'src/app/services/board/board.service';

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
  
  


  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
    this.playerOneFlag = true;
    this.playerTwoFlag = false;    
    this.game = new Game();
    this.start();
  }

  start(): void{
    this.game.setBoard1(this.boardService.generateBoard());
    this.game.setBoard2(this.boardService.generateBoard());
    
    console.log(this.game.getBoard1());
    console.log(this.game.getBoard2());
  }

}
