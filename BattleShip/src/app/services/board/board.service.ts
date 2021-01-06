import { templateJitUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Board } from 'src/app/models/Board';
import { Tile } from 'src/app/models/Tile';
import { NumToAlphaPipe } from 'src/app/pipes/NumberToAlphabet/num-to-alpha.pipe';
import { GameService } from '../game/game.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  
  private numToAlpha: NumToAlphaPipe;

  constructor(private gameService: GameService) { 
    this.numToAlpha = new NumToAlphaPipe();  
  }

  generateBoard(): Board{
    /*
    let temp: Array<Array<string>> = [];

    for(let i = 0; i < this.gameService.getRow(); i++){
      temp.push(new Array<string>());
      for(let j = 0; j < this.gameService.getCol(); j++){
        temp[i].push((i+1)+this.numToAlpha.transform(j+1));
      }
    }

    console.log(temp);
    */

    let tempBoard: Board = new Board();

    for(let i = 0; i < this.gameService.getRow(); i++){
      tempBoard.getTiles().push(new Array<Tile>());
      for(let j = 0; j < this.gameService.getCol(); j++){
        let tempTile = new Tile((i+1)+this.numToAlpha.transform(j+1), false, false, j,  i);
        tempBoard.getTiles()[i].push(tempTile);
      }
    }
    
    // console.log(tempBoard);
    return tempBoard;
  }
}
