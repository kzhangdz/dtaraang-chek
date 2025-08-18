import Event from '../../entities/event'

export default interface IEventDAO{

    getArtistEvents(artistName: string, instagramSourceURL: string): Promise<Event[]>

    getEventById(id: number): Promise<Event|null>

    create(payload: Event): Promise<Event>

    update(id: number, payload: Event): Promise<Event>

    delete(id: number): Promise<Boolean>
}