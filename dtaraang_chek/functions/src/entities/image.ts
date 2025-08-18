import Entity from "./entity";
import { IImage } from "../interfaces/image/image";

export default class Image extends Entity<Image> implements IImage{
    artistName: string; // name of the artist
    instagramPostURL: string; // URL of the Instagram post
    instagramPageNumber: number; // page number of the image on the Instagram post
    instagramSourceURL: string; // source URL from artist's Instagram
    instagramDescription?: string; // description from the Instagram post
    
    storageDisplayURL?: string; // URL of the image in Firebase storage
    id?: string; // Firestore document ID for the image, if applicable
    
    constructor(data: IImage){
        super(data)

        this.artistName = data.artistName
        this.instagramPostURL = data.instagramPostURL; 
        this.instagramPageNumber = data.instagramPageNumber; 
        this.instagramSourceURL = data.instagramSourceURL;

        this.storageDisplayURL = data.storageDisplayURL;
        this.id = data.id;
    }
}