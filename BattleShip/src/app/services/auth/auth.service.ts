import { Injectable } from '@angular/core';
import { Observable, queueScheduler, scheduled} from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  // returns true if username and password are correct, false otherwise
  checkLogin(username:string, password:string):Observable<boolean> {
    // TODO Backend
        
    return scheduled([true],queueScheduler);
  }
}
