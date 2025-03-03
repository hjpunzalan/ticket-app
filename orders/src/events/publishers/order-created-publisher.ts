import { Publisher, OrderCreatedEvent, Subjects } from "@hjtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
