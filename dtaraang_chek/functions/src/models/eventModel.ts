import { FirestoreDataConverter, QueryDocumentSnapshot, GeoPoint, Timestamp } from 'firebase-admin/firestore';

const sampleEventJson = [
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-02",
    "endDate": "2025-08-02",
    "eventName": "งาน Sabb fest 2025 (เวทีเด็กแด้น) (Festival)",
    "location": "ลานกิจกรรมเครื่องบิน Market (เมืองนครปฐม)",
    "coordinates": {
      "lat": 13.84051,
      "lon": 100.04364
    },
    "time": "17:00"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-03",
    "endDate": "2025-08-03",
    "eventName": "งาน LOVEiS Campus Tour (Concert)",
    "location": "ลานหน้าอาคารกีฬาศาลายา, มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
    "coordinates": {
      "lat": 14.072236,
      "lon": 100.600125
    },
    "time": "21:00"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-04",
    "endDate": "2025-08-05",
    "eventName": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-06",
    "endDate": "2025-08-06",
    "eventName": "ร้าน PROMPT จรัญฯ (ร้านกลางคืน)",
    "location": "ร้าน PROMPT จรัญฯ (ร้านกลางคืน)",
    "coordinates": {
      "lat": 13.784518,
      "lon": 100.485149
    },
    "time": "22:30"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-07",
    "endDate": "2025-08-07",
    "eventName": "มาเบล ร่วมงาน Maison Kitsune FW25 Collection Press Preview",
    "location": "ร้าน Maison Kitsune สาขา Emquartier",
    "coordinates": {
      "lat": 13.73142,
      "lon": 100.56939
    },
    "time": "15:00"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-08",
    "endDate": "2025-08-13",
    "eventName": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-14",
    "endDate": "2025-08-14",
    "eventName": "ถ่ายงาน CHAPS",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-15",
    "endDate": "2025-08-15",
    "eventName": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-16",
    "endDate": "2025-08-16",
    "eventName": "งาน 2025 Weibo Cultural Exchange Night in Thailand (Awards)",
    "location": "ศูนย์ประชุมแห่งชาติสิริกิติ์",
    "coordinates": {
      "lat": 13.725798,
      "lon": 100.559235
    },
    "time": "18:30"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-17",
    "endDate": "2025-08-18",
    "eventName": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-19",
    "endDate": "2025-08-19",
    "eventName": "ร้าน Ratch Hour รัชโยธิน (ร้านกลางคืน)",
    "location": "ร้าน Ratch Hour รัชโยธิน (ร้านกลางคืน)",
    "coordinates": {
      "lat": 13.83021,
      "lon": 100.57009
    },
    "time": "23:00"
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-20",
    "endDate": "2025-08-21",
    "eventName": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artistName": "PIXXIE",
    "startDate": "2025-08-22",
    "endDate": "2025-08-22",
    "eventName": "ร่วมงาน JEEP 50th BIRTHDAY PARTY",
    "location": "งานปิด เฉพาะผู้ที่ได้รับเชิญ",
    "coordinates": null,
    "time": null
  }
]

export interface IEvent{
    artistName: string; // name of the artist
    eventName: string; // name of the event
    startDate: string; // start date of the event
    endDate: string; // end date of the event
    time: string; // time of the event
    location: string; // location of the event
    coordinates: { lat: number, lon: number } | null; // coordinates of the event
    ownerUsername: string; 
    imageDocIDs?: string[]; // array of image document IDs associated with the event
    imageDisplayURLs?: string[]; // array of image display URLs associated with the event
    docID?: string; // Firestore document ID for the event, if applicable
}

// EventObject class that EventGemini will inherit from?

export class Event implements IEvent {
    artistName: string; // name of the artist
    eventName: string; // name of the event 
    startDate: string; // start date of the event
    endDate: string; // end date of the event
    time: string; // time of the event
    location: string; // location of the event
    coordinates: { lat: number, lon: number } | null; // coordinates of the event
    ownerUsername: string; 
    imageDocIDs?: string[]; // array of image document IDs associated with the event
    imageDisplayURLs?: string[]; // array of image display URLs associated with the event
    docID?: string; // Firestore document ID for the event, if applicable

    constructor (data: IEvent) {
        this.artistName = data.artistName; // name of the artist
        this.eventName = data.eventName; // name of the event
        this.startDate = data.startDate; // start date of the event
        this.endDate = data.endDate; // end date of the event
        this.time = data.time; // time of the event
        this.location = data.location; // location of the event
        this.coordinates = data.coordinates; // coordinates of the event
        this.ownerUsername = data.ownerUsername; 
        this.imageDocIDs = data.imageDocIDs; // array of image document IDs associated with the event
        this.imageDisplayURLs = data.imageDisplayURLs; // array of image display URLs associated with the event
        this.docID = data.docID; // Firestore document ID for the event, if applicable
    }
    toString() {
        return `Event: ${this.eventName}, Artist: ${this.artistName}, Start Date: ${this.startDate}, End Date: ${this.endDate}, Time: ${this.time}, Location: ${this.location}, Coordinates: ${this.coordinates}, Instagram Owner Username: ${this.ownerUsername}`;
    }
}

//https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter

export interface EventDbModel {
    artistName: string; 
    eventName: string; 
    startDate: string; 
    endDate: string; 
    time: string; 
    location: string;
    coordinates?: GeoPoint | null;
    ownerUsername: string; 
    imageDocIDs?: string[]; 
    imageDisplayURLs?: string[];
    docID?: string; 
    updatedAt?: Timestamp; // ISO date string for the last update
}

export class EventConverter implements FirestoreDataConverter<Event, EventDbModel> {
    toFirestore(event: Event): EventDbModel {
        return {
            artistName: event.artistName,
            eventName: event.eventName,
            startDate: event.startDate,
            endDate: event.endDate,
            time: event.time,
            location: event.location,
            coordinates: this._geopointFromCoordinates(event.coordinates) || null,
            ownerUsername: event.ownerUsername,
            imageDocIDs: event.imageDocIDs || [],
            imageDisplayURLs: event.imageDisplayURLs || [],
            updatedAt: Timestamp.now()
            //docID: event.docID
        };
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<EventDbModel>): Event {
        
        const data = snapshot.data();
        return new Event({
            artistName: data.artistName,
            eventName: data.eventName,
            startDate: data.startDate,
            endDate: data.endDate,
            time: data.time,
            location: data.location,
            coordinates: data.coordinates
                ? { lat: data.coordinates.latitude, lon: data.coordinates.longitude }
                : null,
            ownerUsername: data.ownerUsername,
            imageDocIDs: data.imageDocIDs || [],
            imageDisplayURLs: data.imageDisplayURLs || [],
            docID: snapshot.id
        });
    }

    _geopointFromCoordinates(coordinates: { lat: number, lon: number } | null): GeoPoint | null {
        if (coordinates){
           return new GeoPoint(coordinates.lat, coordinates.lon);
        }
        return null
    }
}

export const sampleEvents = sampleEventJson.map(eventData => new Event(eventData as IEvent))
