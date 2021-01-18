import { UserInfo } from "./UserInfo";

export interface AuthInfo{
    userId: number;
    username: string;
    password: string;
    user: UserInfo;
}