import {ITicketCreatedEvent, Publisher, Subjects} from "@ticketing-services/common";

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}

