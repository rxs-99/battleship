export class Player {
    private username: string;

    constructor(username?: string){
        if(username)
            this.username = username;
    }
}