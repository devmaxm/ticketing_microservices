import { ITicketCreatedEvent, ITicketUpdatedEvent, Listener, Subjects } from "@ticketing-services/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    async onMessage(data: ITicketUpdatedEvent["data"], message: Message): Promise<void> {
        const {id, title, price} = data

        const ticket = Ticket.build({
            id, title, price
        })
        await ticket.save()

        message.ack();
    }
}