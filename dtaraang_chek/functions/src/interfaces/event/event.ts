export interface IEvent{
    artistName: string; // name of the artist
    eventName: string; // name of the event
    startDate: string; // start date of the event
    endDate: string; // end date of the event
    time: string; // time of the event
    location: string; // location of the event
    coordinates: { lat: number, lon: number } | null; // coordinates of the event 

    id?: string;
    
    // foreign keys/firebase information
    // ownerUsername: string;
    // imageDocIDs?: string[]; // array of image document IDs associated with the event
    // imageDisplayURLs?: string[]; // array of image display URLs associated with the event
    // docID?: string; // Firestore document ID for the event, if applicable

}