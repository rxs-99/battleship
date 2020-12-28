export class Player {
    username: string;

    constructor(username?: string){
        if(username)
            this.username = username;
    }
}