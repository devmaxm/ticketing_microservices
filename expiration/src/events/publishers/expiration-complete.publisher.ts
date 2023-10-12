import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketing-services/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}