import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

export interface IImage{
    artistName: string; // name of the artist
    instagramPostURL: string; // URL of the Instagram post
    instagramPageNumber: number; // page number of the image on the Instagram post
    instagramSourceURL: string; // source URL from artist's Instagram
    instagramDescription?: string; // description from the Instagram post
    firebaseDisplayURL?: string; // URL of the image in Firebase storage
    docID?: string; // Firestore document ID for the image, if applicable
}

export class Image implements IImage{
    artistName: string; // name of the artist
    instagramPostURL: string; // URL of the Instagram post
    instagramPageNumber: number; // page number of the image on the Instagram post
    instagramSourceURL: string; // source URL from artist's Instagram
    instagramDescription?: string; // description from the Instagram post
    firebaseDisplayURL?: string; // URL of the image in Firebase storage 
    docID?: string; // Firestore document ID for the image, if applicable

    constructor (data: IImage) {
        this.artistName = data.artistName; // name of the artist
        this.firebaseDisplayURL = data.firebaseDisplayURL; // URL of the image in Firebase storage
        this.instagramPostURL = data.instagramPostURL; // URL of the Instagram post
        this.instagramPageNumber = data.instagramPageNumber; // page number of the image on the Instagram post
        this.instagramSourceURL = data.instagramSourceURL; // source URL from artist's Instagram
        this.instagramDescription = data.instagramDescription; // description from the Instagram post
        this.docID = data.docID; // Firestore document ID for the image, if applicable
    }        
    toString()  {
        return `Image: ${this.firebaseDisplayURL}, Artist: ${this.artistName}, Instagram Page Number: ${this.instagramPageNumber}, Instagram Source URL: ${this.instagramSourceURL}, Description: ${this.instagramDescription}`;
    }   

    getPostID(): string{
        const parts = this.instagramPostURL.split('/');
        const postID = parts[parts.length - 2];
        return postID
    }

    getFileName(): string{
        const file_name = `${this.getPostID()}_${this.instagramPageNumber}.jpg`

        return file_name;
    }
}

interface ImageDbModel {
    artistName: string; 
    firebaseDisplayURL: string; 
    instagramPostURL: string;
    instagramPageNumber: number; 
    instagramSourceURL: string; 
    instagramDescription?: string; 
    docID?: string;
}

export class ImageConverter implements FirestoreDataConverter<Image, ImageDbModel>{
    toFirestore(image: Image): ImageDbModel{
        return {
            artistName: image.artistName,
            firebaseDisplayURL: image.firebaseDisplayURL ?? "",
            instagramPostURL: image.instagramPostURL,
            instagramPageNumber: image.instagramPageNumber,
            instagramSourceURL: image.instagramSourceURL,
            instagramDescription: image.instagramDescription ?? ""
        };
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Image {
        const data = snapshot.data();
        return new Image({
            artistName: data.artistName, 
            firebaseDisplayURL: data.firebaseDisplayURL, 
            instagramPostURL: data.instagramPostURL,
            instagramPageNumber: data.instagramPageNumber, 
            instagramSourceURL: data.instagramSourceURL, 
            instagramDescription: data.instagramDescription,
            docID: snapshot.id 
        });
    }
}