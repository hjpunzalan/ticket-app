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

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response) => {
		// Check if order Id is valid
		if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
			throw new BadRequestError("Order id is invalid.");
		}

		const order = await Order.findById(req.params.orderId);
		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		res.status(204).send(order);
	}
);

export { router as deleteOrderRouter };
