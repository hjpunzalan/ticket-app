import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "./../../nats-wrapper";

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
	test("returns an error if the ticket is already reserved", () => {});
	test("reserves a ticket", () => {});
});
