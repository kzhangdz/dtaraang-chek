export interface IArtist{
    artistName: string; // name of the artist
    displayName: string; // name of the event
    instagramSourceURL: string // source where event data comes from
    pictureDisplayURL?: string
    description?: string

    id?: string;
    
    // foreign keys/firebase information
    // ownerUsername: string;
    // imageDocIDs?: string[]; // array of image document IDs associated with the event
    // imageDisplayURLs?: string[]; // array of image display URLs associated with the event
    // docID?: string; // Firestore document ID for the event, if applicable

}