import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent } from "@hjtickets/common";
import { natsWrapper } from "./../../../nats-wrapper";
import { ExpirationCompleteListener } from "./../expiration-complete.listener";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = await Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();
	const order = Order.build({
		status: OrderStatus.Created,
		userId: "randomId",
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, order, data, msg };
};

test("updates the order status to cancelled", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

test("emit and OrderCancelled event ", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	// Ensure event data is same as order id
	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(eventData.id).toEqual(order.id);
});

test("acks the message", async () => {
	const { listener, order, ticket, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
