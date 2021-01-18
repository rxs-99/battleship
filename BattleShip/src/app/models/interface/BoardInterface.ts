import { Player } from "../Player";
import { Tile } from "../Tile";

export interface BoardInterface{
    id: number;
    player: Player;
    tiles: Array<Array<Tile>>;
}