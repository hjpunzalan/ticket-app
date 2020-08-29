import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

test("should find the order by order id and delete it", async () => {
	// Create the ticket
	const ticket = Ticket.build({
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
	const { body: deletedOrder } = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(200);

	expect(deletedOrder.id).toEqual(order.id);
});

test("returns an error if one user tries to fetch another user's order", async () => {
	// Create the ticket
	const ticket = Ticket.build({
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
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", global.signin())
		.send()
		.expect(401);
});

test("marks an order as cancelled", async () => {});
