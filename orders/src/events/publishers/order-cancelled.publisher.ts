import { OrderCancelledEvent, Publisher, Subjects } from "@ticketing-services/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

