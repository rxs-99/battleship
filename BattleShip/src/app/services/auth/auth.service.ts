import { Injectable } from '@angular/core';
import { Observable, queueScheduler, scheduled} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Login } from 'src/app/models/interface/Login';
import { environment } from 'src/environments/environment';
import { APIMap } from 'src/app/utility/apiMap';
import { UserInfo } from 'src/app/models/interface/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  // returns true if username and password are correct, false otherwise
  checkLogin(username:string, password:string):Observable<UserInfo> {
    let httpHeader: HttpHeaders = new HttpHeaders().set('Content-Type','application/json');
    let loginInfo: Login = {username: username, password : password};

    //return scheduled([true],queueScheduler);
    return this.http.post(APIMap.login, loginInfo, {headers:httpHeader}) as Observable<UserInfo>;
  }
}
