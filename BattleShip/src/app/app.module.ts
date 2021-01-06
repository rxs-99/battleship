import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/body/home/home.component';
import { LoginComponent } from './components/body/login/login.component';
import { RegisterComponent } from './components/body/register/register.component';
import { BodyComponent } from './components/body/body.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './components/body/game/game.component';
import { NumToArrPipe } from './pipes/NumberToArray/num-to-arr.pipe';
import { NumToAlphaPipe } from './pipes/NumberToAlphabet/num-to-alpha.pipe';
import { ShipComponent } from './components/ship/ship.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BodyComponent,
    GameComponent,
    NumToArrPipe,
    NumToAlphaPipe,
    ShipComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
