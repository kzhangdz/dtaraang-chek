import Entity from "./entity";
import { IEvent } from "../interfaces/event/event";

export default class Event extends Entity<Event> implements IEvent{
    artistName: string; // name of the artist
    eventName: string; // name of the event
    startDate: string; // start date of the event
    endDate: string; // end date of the event
    time: string; // time of the event
    location: string; // location of the event
    coordinates: { lat: number, lon: number } | null; // coordinates of the event 

    id?: string
    
    constructor(data: IEvent){
        super(data)

        this.artistName = data.artistName
        this.eventName = data.eventName; // name of the event
        this.startDate = data.startDate; // start date of the event
        this.endDate = data.endDate; // end date of the event
        this.time = data.time; // time of the event
        this.location = data.location; // location of the event
        this.coordinates = data.coordinates; // coordinates of the event

        this.id = data.id;
    }
    // toString() {
    //     return `Event: ${this.eventName}, Artist: ${this.artistName}, Start Date: ${this.startDate}, End Date: ${this.endDate}, Time: ${this.time}, Location: ${this.location}, Coordinates: ${this.coordinates}`;
    // }
}

if (require.main === module){
    const data = {
        "artistName": "PIXXIE",
        "startDate": "2025-08-16",
        "endDate": "2025-08-16",
        "eventName": "งาน 2025 Weibo Cultural Exchange Night in Thailand (Awards)",
        "location": "ศูนย์ประชุมแห่งชาติสิริกิติ์",
        "coordinates": {
        "lat": 13.725798,
        "lon": 100.559235
        },
        "time": "18:30",
        // extra input
        "ownerUsername": "test"
    }
    const event = new Event(data)
    console.log(event.toString())
}