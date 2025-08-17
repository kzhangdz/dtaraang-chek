// might need a Storage api client as well

import * as admin from 'firebase-admin';

// Re-using core types for clarity and consistency
import {
  //CollectionReference,
  DocumentData,
  //DocumentReference,
} from '@firebase/firestore-types';

import { db } from '../config';
import { Event, EventConverter } from '../models/eventModel';

/**
 * A general-purpose API client for Firestore collections using the Firebase Admin SDK.
 * This class is designed for use in a trusted server environment (Node.js) and
 * provides a type-safe and consistent way to interact with Firestore.
 *
 * It encapsulates common database operations and bypasses client-side security rules.
 *
 * @template T The data class type for the collection (e.g., `Event`, `User`).
 */
export class FirestoreApiClient<T extends DocumentData> {
  private collectionRef: admin.firestore.CollectionReference;

  //TODO: functions to start and end transactions?

  /**
   * Constructs a new Firestore API client for the Admin SDK.
   *
   * @param db The initialized `admin.firestore.Firestore` database instance.
   * @param collectionName The name of the Firestore collection.
   */
  constructor(collectionRef: admin.firestore.CollectionReference) {
    this.collectionRef = collectionRef;
  }

  /**
   * Gets a reference to a document by its ID.
   *
   * @param id The ID of the document.
   * @returns A Promise that resolves to the document reference.
   */
  public getDocRef(id: string): admin.firestore.DocumentReference {
    return this.collectionRef.doc(id);
  }

  /**
   * Retrieves a single document by its ID.
   *
   * @param id The ID of the document.
   * @returns A Promise that resolves to the document data, or `null` if the document does not exist.
   */
  public async getDoc(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return docSnap.data() as T;
      }
      return null;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  /**
   * Retrieves all documents from the collection.
   *
   * @returns A Promise that resolves to an array of document data.
   */
  public async getAllDocs(): Promise<T[]> {
    try {
      const querySnapshot = await this.collectionRef.get();
      return querySnapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error('Error fetching all documents:', error);
      throw error;
    }
  }

  /**
   * Sets or updates a document with a specific ID.
   * If the document does not exist, it will be created.
   *
   * @param id The ID of the document to set.
   * @param data The data to set.
   * @returns A Promise that resolves when the operation is complete.
   */
  public async setDoc(id: string, data: T): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      // Removed the WithFieldValue cast
      await docRef.set(data);
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  /**
   * Adds a new document with an automatically generated ID.
   *
   * @param data The data for the new document.
   * @returns A Promise that resolves to the ID of the new document.
   */
  public async addDoc(data: T): Promise<string> {
    try {
      // Removed the WithFieldValue cast
      const docRef = await this.collectionRef.add(data);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  /**
   * Deletes a document by its ID.
   *
   * @param id The ID of the document to delete.
   * @returns A Promise that resolves when the operation is complete.
   */
  public async deleteDoc(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await docRef.delete();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}


if (require.main === module) {

    // declare event
    const sampleEvent = new Event({
        artistName: "Sample Artist",
        eventName: "Sample Event",
        startDate: "2024-10-01",
        endDate: "2024-10-02",
        time: "18:00",
        location: "Sample Venue",
        coordinates: { lat: 37.7749, lon: -122.4194 },
        ownerUsername: "sampleuser",
        imageDocIDs: []
    });

    const eventConverter = new EventConverter();
    const eventJson = eventConverter.toFirestore(sampleEvent);

    const eventsCollectionRef = db.collection('events');

    const client = new FirestoreApiClient(eventsCollectionRef);

    // const collectionName = 'events';
    // const parentDocRef = doc(db, collectionName, sampleEvent.ownerUsername);

    // const eventsCollectionRef = collection(parentDocRef, 'events').withConverter(eventConverter) as CollectionReference<Event>;

    // const client = new FirestoreApiClient<Event>(eventsCollectionRef);

    async function write(){
        const newDocId = await client.addDoc(eventJson)
        console.log(`Wrote event ${newDocId} to Firestore`);
    }

    write().catch(console.error);
}


// /**
//  * Demonstrates how to write an Event document to Firestore using the converter.
//  */
// async function writeEventToFirestore(event: Event) {
//   // Get a reference to the 'events' collection, applying the eventConverter.
//   // This tells Firestore how to handle the Event class.
//   const eventsCollection = collection(db, 'events').withConverter(eventConverter);

//   // Get a document reference and set the data.
//   const eventDocRef = doc(eventsCollection, event.id);
//   await setDoc(eventDocRef, event);

//   console.log(`Event with ID: ${event.id} has been written to Firestore.`);
// }

// /**
//  * Demonstrates how to read an Event document from Firestore using the converter.
//  */
// async function readEventFromFirestore(eventId: string) {
//   // Get a reference to the 'events' collection with the converter.
//   const eventsCollection = collection(db, 'events').withConverter(eventConverter);

//   // Get the document snapshot. The converter will automatically turn it into an Event instance.
//   const docRef = doc(eventsCollection, eventId);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     // The data is already an instance of our Event class, so we can access its methods.
//     const retrievedEvent = docSnap.data();
//     console.log('Retrieved event:', retrievedEvent.getSummary());
//   } else {
//     console.log("No such event document!");
//   }
// }