import {Listener, OrderCreatedEvent, OrderStatus, Subjects} from '@ticketing-services/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCreatedListenet extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName
    subject: Subjects.OrderCreated = Subjects.OrderCreated

    async onMessage(data: OrderCreatedEvent["data"], message: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
          });
          await order.save();
      
          message.ack();
    }
}