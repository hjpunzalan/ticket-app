import { Message } from "node-nats-streaming";
import {
	Listener,
	OrderCancelledEvent,
	Subjects,
	OrderStatus,
} from "@hjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		// Finding and deleting will require previous version from the event ie. current version in payments service
		const order = await Order.findOne({
			_id: data.id,
			version: data.version - 1,
		});
		if (!order) throw new Error("Order not found");
		order.set({ status: OrderStatus.Cancelled });
		await order.save();

		msg.ack();
	}
}
