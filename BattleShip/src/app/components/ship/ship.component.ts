import { Component, OnInit } from '@angular/core';
import { Ship } from 'src/app/models/Ship';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {

  private ships: Ship[];
  
  constructor() { }

  ngOnInit(): void {
  }

  
}
