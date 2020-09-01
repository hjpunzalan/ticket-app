import { Publisher, OrderCancelledEvent, Subjects } from "@hjtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
