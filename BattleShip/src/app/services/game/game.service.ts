import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private row: number;
  private col: number;

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
}
