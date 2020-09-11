import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@hjtickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// creates an instance of the listener
	const listener = new TicketCreatedListener(natsWrapper.client);

	// create a fake data event
	const data: TicketCreatedEvent["data"] = {
		version: 0,
		id: mongoose.Types.ObjectId().toHexString(),
		title: "Concert",
		price: 20,
		userId: mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	// mock ack method and confirm it has been called
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

test("creates and saves a ticket", async () => {
	const { listener, data, msg } = await setup();

	// call the onMessage function with the data object + message object
	await listener.onMessage(data, msg);

	// write assertions to makse sure a ticket was created!
	const ticket = await Ticket.findById(data.id);

	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

test("ack the message", async () => {
	// call the onMessage function with the data object + message object
	// write assertions to makse sure a ticket was created!
});
