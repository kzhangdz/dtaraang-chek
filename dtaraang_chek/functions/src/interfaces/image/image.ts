export interface IImage{
    artistName: string; // name of the artist
    instagramPostURL: string; // URL of the Instagram post
    instagramPageNumber: number; // page number of the image on the Instagram post
    instagramSourceURL: string; // source URL from artist's Instagram
    instagramDescription?: string; // description from the Instagram post
    
    storageDisplayURL?: string; // URL of the image in Firebase storage
    id?: string; // Firestore document ID for the image, if applicable

    // postID?
    
    // foreign keys/firebase information
    // ownerUsername: string;
    // imageDocIDs?: string[]; // array of image document IDs associated with the event
    // imageDisplayURLs?: string[]; // array of image display URLs associated with the event
    // docID?: string; // Firestore document ID for the event, if applicable

}