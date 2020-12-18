import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BoardOneComponent } from './components/body/game/board-one/board-one.component';
import { BoardTwoComponent } from './components/body/game/board-two/board-two.component';
import { HomeComponent } from './components/body/home/home.component';
import { LoginComponent } from './components/body/login/login.component';
import { RegisterComponent } from './components/body/register/register.component';
import { BodyComponent } from './components/body/body.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './components/body/game/game.component';
import { NumToArrPipe } from './pipes/NumberToArray/num-to-arr.pipe';
import { NumToAlphaPipe } from './pipes/NumberToAlphabet/num-to-alpha.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BoardOneComponent,
    BoardTwoComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BodyComponent,
    GameComponent,
    NumToArrPipe,
    NumToAlphaPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
