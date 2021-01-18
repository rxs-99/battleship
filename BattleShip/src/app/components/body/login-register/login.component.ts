import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo } from 'src/app/models/interface/AuthInfo';
import { Player } from 'src/app/models/Player';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';
import { HeaderService } from 'src/app/services/header/header.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // sign in info
  username: string;
  password: string;

  // sign up info
  rePassword: string;
  email: string;

  incorrectAuthFlag: boolean;

  signUpFlag: boolean;

  constructor(private authService: AuthService, private headerService: HeaderService, private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
    this.rePassword = "";
    this.email = "";
    this.incorrectAuthFlag = false;
    this.signUpFlag = false;
  }

  onClickSignIn(): void {
    this.authService.checkLogin(this.username, this.password).subscribe(
      (response) => {
        if (response) {
          this.password = "";
          this.headerService.updateUsername(this.username);
          this.headerService.toggleDropdown();
          this.gameService.setPlayer(new Player(this.username, response));
          this.router.navigateByUrl("/body/home");
        } else {
          this.incorrectAuthFlag = true;
          setTimeout(() => {
            this.incorrectAuthFlag = false;
          }, 5000);
          console.log("Invalid username or password");
        }
      },
      () => { console.log("Unable to verify."); }
    );
  }

  onClickSignUp(): void {
    if (!this.signUpFlag) this.signUpFlag = true;
    else {

      let authInfo: AuthInfo = {
        userId: 0,
        username: this.username,
        password: this.password,
        user: {
          id: 0,
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          email: this.email
        }
      }

      this.authService.save(authInfo).subscribe(
        (response) => {
          console.log("after register");
          console.log(response);

          this.password = "";
          this.headerService.updateUsername(this.username);
          this.headerService.toggleDropdown();
          this.gameService.setPlayer(new Player(this.username, response));
          this.router.navigateByUrl("/body/home");
        },
        () => { console.log("Unable to register. Try again!"); }
      );
    }
  }

}
