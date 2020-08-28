import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
	requireAuth,
	BadRequestError,
	NotFoundError,
	NotAuthorizedError,
} from "@hjtickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
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

		res.send(order);
	}
);

export { router as showOrderRouter };
