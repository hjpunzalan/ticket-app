import mongoose from "mongoose";
import { message } from "node-nats-streaming";
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
