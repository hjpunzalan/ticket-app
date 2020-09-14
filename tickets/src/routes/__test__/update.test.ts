import request from "supertest";
import mongoose from "mongoose";
import { natsWrapper } from "./../../nats-wrapper";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

test("returns a 404 if the provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "concert",
			price: 20,
		})
		.expect(404);
});

test("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "concert",
			price: 20,
		})
		.expect(401);
});

test("returns a 404 if the user does not own the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "concert",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "dsadsadas",
			price: 20,
		})
		.expect(401);
});

test("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "concert",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "testing",
			price: -10,
		})
		.expect(400);
});

test("update the ticket provided valid inputs", async () => {
	const cookie = global.signin();
	const newTitle = "hello";
	const newPrice = 5;
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "concert",
			price: 20,
		});
	// Update ticket
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual(newTitle);
	expect(ticketResponse.body.price).toEqual(newPrice);
});

test("publishes an event", async () => {
	const cookie = global.signin();
	const newTitle = "hello";
	const newPrice = 5;
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "concert",
			price: 20,
		});
	// Update ticket
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test("rejects the update if the ticket is already reserved", async () => {
	const cookie = global.signin();
	const newTitle = "hello";
	const newPrice = 5;
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "concert",
			price: 20,
		});

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
	await ticket!.save();

	// Update ticket and expect a bad request error
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.expect(400);
});
