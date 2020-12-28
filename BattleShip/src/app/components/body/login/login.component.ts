import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/Player';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';
import { HeaderService } from 'src/app/services/header/header.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:string;
  password:string;
  // header:HeaderComponent;

  incorrectAuthFlag: boolean;

  constructor(private authService: AuthService, private headerService: HeaderService, private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
    this.incorrectAuthFlag = false;
  }

  onClickSignIn() {
    this.authService.checkLogin(this.username, this.password).subscribe(
      (response) => {
        if(response == true){
         this.headerService.updateUsername(this.username);
         this.headerService.toggleDropdown();
         this.gameService.setPlayer(new Player(this.username));
         this.router.navigateByUrl("/body/home");
        }
      },
      () => {console.log("Unable to verify.")}
    );
  }

}
