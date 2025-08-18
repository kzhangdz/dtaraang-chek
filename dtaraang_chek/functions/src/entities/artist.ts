import Entity from "./entity";
import { IArtist } from "../interfaces/artist/artist";

export default class Artist extends Entity<Artist> implements IArtist{
    artistName: string; // name of the artist
    displayName: string; // name of the event
    instagramSourceURL: string // source where event data comes from
    pictureDisplayURL?: string
    description?: string

    id?: string;

    constructor(data: IArtist){
        super(data)

        this.artistName = data.artistName
        this.displayName = data.displayName
        this.instagramSourceURL = data.instagramSourceURL
        this.pictureDisplayURL = data.pictureDisplayURL
        this.description = data.description

        this.id = data.id;
    }

}
