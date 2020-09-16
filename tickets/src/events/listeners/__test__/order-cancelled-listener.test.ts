import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@hjtickets/common";
import { OrderCancelledListener } from "./../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listener
	const listener = new OrderCancelledListener(natsWrapper.client);

	// Create and save a ticket
	const orderId = mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: "Concert",
		price: 99,
		userId: "asdf",
	});
	ticket.set({ orderId });
	await ticket.save();

	// Create the fake data event
	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		userId: "dsadsa",
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

test("sets the orderId to undefined", async () => {
	const { listener, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toBeUndefined();
});

test("acks the message", async () => {
	const { listener, data, ticket, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

test("publishes a ticket updated event and its the correct data", async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(ticketUpdatedData.orderId).toBeUndefined();
});
