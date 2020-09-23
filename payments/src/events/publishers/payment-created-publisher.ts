import { Subjects, Publisher, PaymentCreatedEvent } from "@hjtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
