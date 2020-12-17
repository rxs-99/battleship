import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private message = new Subject<string>();

  private dropdownFlag: boolean;
  private timerFlag: boolean;
  private username: string;

  constructor() { 
    this.dropdownFlag = false;
    this.timerFlag = false;
    this.username = "";
  }

  getMessage(): Observable<string>{
    return this.message.asObservable();
  }

  updateMessage(message: string): void{
    this.message.next(message);
  }

  updateUsername(username: string): void{
    this.username = username;
    this.updateMessage("update username");

    console.log("update username");
  }

  toggleTimer(): void {
    this.timerFlag = !this.timerFlag;
    this.updateMessage("toggle timer");
  }

  toggleDropdown(): void {
    this.dropdownFlag = !this.dropdownFlag;
    this.updateMessage("toggle dropdown");

    console.log("update dropdown");
  }

  getDropdownFlag(): boolean{
    return this.dropdownFlag;
  }

  getTimerFlag(): boolean{
    return this.timerFlag;
  }

  getUsername(): string{
    return this.username;
  }
}
