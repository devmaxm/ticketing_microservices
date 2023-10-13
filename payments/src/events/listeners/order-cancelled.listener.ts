import {Listener, OrderCancelledEvent, OrderStatus, Subjects} from '@ticketing-services/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCreatedListenet extends Listener<OrderCancelledEvent> {
    queueGroupName = queueGroupName
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled

    async onMessage(data: OrderCancelledEvent["data"], message: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
          });
      
          if (!order) {
            throw new Error('Order not found');
          }
      
          order.set({ status: OrderStatus.Cancelled });
          await order.save();
      
          message.ack();
    }
}