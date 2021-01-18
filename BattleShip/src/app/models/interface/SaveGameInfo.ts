import { UserInfo } from "./UserInfo";

export interface SaveGameInfo {
    id: number;
    saveName: string;
    jsonAsText: string;
    timeStamp: Date;
    user: UserInfo;
}