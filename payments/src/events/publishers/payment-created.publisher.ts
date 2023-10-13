import { Subjects, Publisher, PaymentCreatedEvent } from '@ticketing-services/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
