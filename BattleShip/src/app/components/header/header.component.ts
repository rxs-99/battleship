import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // flags that control whether the timer and dropdown menu is visible or not
  timerFlag: boolean;
  dropdownFlag: boolean;

  constructor() { 
    this.timerFlag = false;
    this.dropdownFlag = false;
  }

  ngOnInit(): void {
  }

  toggleTimer(): void{
    this.timerFlag = !this.timerFlag;
  }

  toggleDropdown(): void{
    this.dropdownFlag = !this.dropdownFlag;
  }

}
