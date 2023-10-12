import { ITicketUpdatedEvent, Listener, Subjects } from "@ticketing-services/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    async onMessage(data: ITicketUpdatedEvent["data"], message: Message): Promise<void> {
        const ticket = await Ticket.findByEvent({ id: data.id, version: data.version })

        if (!ticket) {
            throw Error('Ticket not found')
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        message.ack();
    }
}