import { environment } from "src/environments/environment";

export const APIMap = {
    login: environment.apiServer + "auth/login/",
    saveGame: environment.apiServer + "game/save/"
}