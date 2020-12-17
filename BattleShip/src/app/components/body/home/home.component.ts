import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.menu.push("New Game");
    this.menu.push("Load Game");
    this.menu.push("Toggle Sound");
  }

  onClick(menuOption: string): void{
    if(menuOption === "New Game")
      console.log("TODO -- " + menuOption);
    else if(menuOption === "Load Game")
      console.log("TODO -- " + menuOption);
    else if(menuOption === "Toggle Sound")
      console.log("TODO -- " + menuOption);
  }

}
