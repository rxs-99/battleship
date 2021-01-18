import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { HeaderService } from 'src/app/services/header/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // flags that control whether the timer and dropdown menu is visible or not
  timerFlag: boolean;
  dropdownFlag: boolean;

  username: string;

  subscription: Subscription;

  constructor(private headerService: HeaderService, private gameService: GameService) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.timerFlag = this.headerService.getTimerFlag();
    this.dropdownFlag = this.headerService.getDropdownFlag();
    this.username = this.headerService.getUsername();

    // subscribe to headerService
    this.subscription = this.headerService.getMessage().subscribe((message) => { this.handleMessage(message) });
  }

  handleMessage(message: string): void {
    if (message === "toggle dropdown")
      this.dropdownFlag = this.headerService.getDropdownFlag();
    else if (message === "toggle timer")
      this.timerFlag = this.headerService.getTimerFlag();
    else if (message === "update username")
      this.username = this.headerService.getUsername();

    console.log("inside handle message");
    console.log(this.username);
    console.log(this.dropdownFlag);
  }

  @HostListener("window:beforeunload", ["$event"]) 
  unloadHandler(event: Event) {
    this.gameService.savePlayerOnSessionStorage();
  }
}
