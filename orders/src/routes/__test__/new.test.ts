import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "./../../nats-wrapper";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

describe("Request validation", () => {
	test("has a route handler listening to /api/orders for post requests", async () => {
		const response = await request(app).post("/api/orders").send({});
		expect(response.status).not.toEqual(404);
	});

	test("can only be accessed if the user is signed in", async () => {
		const response = await request(app)
			.post("/api/orders")
			.send({})
			.expect(401);
	});

	test("returns a status other than 401 if the user is signed in", async () => {
		const response = await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({});

		expect(response.status).not.toEqual(401);
	});

	test("returns an error if an invalid ticketId is provided", async () => {
		await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({ ticketId: "" })
			.expect(400);

		// if valid ticket is provided should pass
		const id = new mongoose.Types.ObjectId().toHexString();
		await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({ ticketId: id })
			.expect(404);
	});
});

describe("Order creation", () => {
	test("returns an error if the ticket does not exist", async () => {
		// if valid ticket is provided should pass
		const id = new mongoose.Types.ObjectId().toHexString();
		await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({
				ticketId: id,
			})
			.expect(404);
	});
	test("returns an error if the ticket is already reserved", async () => {
		const ticket = Ticket.build({
			title: "concert",
			price: 20,
		});
		await ticket.save();

		const order = Order.build({
			userId: "randomId",
			status: OrderStatus.Created,
			expiresAt: new Date(),
			ticket,
		});
		await order.save();

		await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({
				ticketId: ticket.id,
			})
			.expect(400);
	});
	test("reserves a ticket", async () => {
		const ticket = Ticket.build({
			title: "concert",
			price: 20,
		});
		await ticket.save();

		await request(app)
			.post("/api/orders")
			.set("Cookie", global.signin())
			.send({
				ticketId: ticket.id,
			})
			.expect(201);

		const orders = await Order.find({});
		expect(orders.length).toEqual(1);
		expect(orders[0].ticket.toString()).toEqual(ticket.id);
	});

	test.todo("emits an order created event");
});
