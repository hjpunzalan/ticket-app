import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

test("should fetch the order by", async () => {
	// Create the ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const user = global.signin();

	// make a request to build an order with this
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to fetch the order
	const { body: fetchOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(200);

	expect(fetchOrder.id).toEqual(order.id);
});

test("returns an error if one user tries to fetch another user's order", async () => {
	// Create the ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const user = global.signin();

	// make a request to build an order with this
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to fetch the order
	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", global.signin())
		.send()
		.expect(401);
});
