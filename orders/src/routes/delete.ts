import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
	requireAuth,
	BadRequestError,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
} from "@hjtickets/common";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		// Check if order Id is valid
		if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
			throw new BadRequestError("Order id is invalid.");
		}

		const order = await Order.findById(req.params.orderId).populate("ticket");
		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		// publish and event saying this was cancelled!
		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(200).send(order);
	}
);

export { router as deleteOrderRouter };
