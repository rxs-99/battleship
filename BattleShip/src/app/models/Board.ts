import { Player } from "./Player";
import { Tile } from "./Tile";

export class Board{
    id: number;
    player: Player;
    tiles: Array<Array<Tile>>;

    constructor(id?: number, player?: Player, tiles?: Array<Array<Tile>>){
        if(id && player && tiles){
            this.id = id;
            this.player = player;
            this.tiles = tiles;
        } else if (id && player){
            this.id = id;
            this.player = player;
            this.tiles = [];
        } else if (id && tiles){
            this.id = id;
            this.tiles = tiles;
        } else if (player && tiles){
            this.player = player;
            this.tiles = tiles;
        } else {
            this.tiles = [];
            this.player = new Player();
        }
    }

    setId(id: number): void{
        this.id = id;
    }

    setPlayer(player: Player): void{
        this.player = player;
    }

    setTiles(tiles: Array<Array<Tile>>): void{
        this.tiles = tiles;
    }

    getId(): number{
        return this.id;
    }

    getPlayer(): Player{
        return this.player;
    }

    getTiles(): Array<Array<Tile>>{
        return this.tiles;
    }
}