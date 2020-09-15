import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from "@hjtickets/common";

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	readonly subject = Subjects.ExpirationComplete;
}
