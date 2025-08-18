import Event from '../../entities/event'
//import { ValidationError } from '../../errors'
import IUseCase from '../../interfaces/useCase'
import IEventDAO from '../../interfaces/event/eventDAO'

export default class CreateEvent implements IUseCase<Event> {
    eventDAO: IEventDAO

    constructor(
        eventDAO: IEventDAO
    ){
        this.eventDAO = eventDAO
    }

    async call(payload: Event): Promise<Event>{
        // TODO: needs image data included on the payload

        return this.eventDAO.create(payload)
    }
}