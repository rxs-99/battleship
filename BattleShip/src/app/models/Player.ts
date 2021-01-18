import { UserInfo } from "./interface/UserInfo";

export class Player {
    username: string;
    userInfo: UserInfo;

    constructor(username?: string, userInfo?: UserInfo){
        if(username)
            this.username = username;
        if(userInfo)
            this.userInfo = userInfo;
    }
}