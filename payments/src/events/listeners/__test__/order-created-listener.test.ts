import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@hjtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);
	const data: OrderCreatedEvent["data"] = {
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		userId: "dsadssa",
		expiresAt: "dsadsad",
		version: 0,
		ticket: {
			id: mongoose.Types.ObjectId().toHexString(),
			price: 20,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

test("replicates the order info", async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order!.id).toEqual(data.id);
	expect(order!.status).toEqual(data.status);
	expect(order!.userId).toEqual(data.userId);
	expect(order!.price).toEqual(data.ticket.price);
});

test("acks the message", async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
