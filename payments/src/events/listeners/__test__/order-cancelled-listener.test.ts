import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@hjtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: "dsadssa",
		status: OrderStatus.Created,
		price: 20,
		version: 0,
	});

	await order.save();

	// Order version + 1 because of updated order event
	const data: OrderCancelledEvent["data"] = {
		id: order.id,
		userId: order.userId,
		version: 1,
		ticket: {
			id: mongoose.Types.ObjectId().toHexString(),
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, order, data, msg };
};

test("updates the status of the order", async () => {
	const { listener, order, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const cancelledOrder = await Order.findById(order.id);

	expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

test("acks the message", async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
