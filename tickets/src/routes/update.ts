import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
	BadRequestError,
	validateRequest,
	NotFoundError,
	requireAuth,
	NotAuthorizedError,
} from "@hjtickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "./../nats-wrapper";

const router = express.Router();

router.put(
	"/api/tickets/:id",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be provided and greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.orderId)
			throw new BadRequestError("Cannot edit a reserved ticket");

		// If user logged in is not the user who created ticket, throw error
		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		// Update ticket
		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});

		await ticket.save();

		// send event
		new TicketUpdatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
		});

		res.send(ticket);
	}
);

export { router as updateTicketRouter };
