import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@hjtickets/common";
import { TicketUpdatedListener } from "./../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// creates an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	// create and save a ticket
	const ticket = await Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	// create a fake data event
	const data: TicketUpdatedEvent["data"] = {
		version: ticket.version + 1,
		id: ticket.id,
		title: "new concert",
		price: 999,
		userId: "randomstring",
	};

	// create a fake message object
	// mock ack method and confirm it has been called
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	// return all params
	return { ticket, listener, data, msg };
};

test("finds, updates, and saves a ticket", async () => {
	const { ticket, listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

test("acks the message", async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
