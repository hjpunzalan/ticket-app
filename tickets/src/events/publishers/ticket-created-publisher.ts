import { Publisher, Subjects, TicketCreatedEvent } from "@hjtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
