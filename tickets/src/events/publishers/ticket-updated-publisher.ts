import { Publisher, Subjects, TicketUpdatedEvent } from "@hjtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
