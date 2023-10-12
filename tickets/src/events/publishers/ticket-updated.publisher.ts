import {ITicketCreatedEvent, ITicketUpdatedEvent, Publisher, Subjects} from "@ticketing-services/common";

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

