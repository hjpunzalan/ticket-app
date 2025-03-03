import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

test("returns a 404 when purchasing an order that does not exist", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "sdsadsa",
			orderId: mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

test("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		price: 20,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			token: "sdsadsa",
			orderId: order.id,
		})
		.expect(401);
});

test("returns a 400 when purchasing a cancelled order", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId,
		version: 0,
		price: 20,
		status: OrderStatus.Cancelled,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "sdsadsa",
			orderId: order.id,
		})
		.expect(400);
});

test("returns a 204 with valid inputs", async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 100000);
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		userId,
		version: 0,
		price,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			token: "tok_visa",
			orderId: order.id,
		})
		.expect(201);
	// There many new test after this one that can exceed stripe charge list limit of 10
	const stripeCharges = await stripe.charges.list({ limit: 50 });
	const stripeCharge = stripeCharges.data.find(
		(charge) => charge.amount === price * 100
	);

	expect(stripeCharge).toBeDefined();
	expect(stripeCharge!.currency).toEqual("aud");

	const payment = await Payment.findOne({
		orderId: order.id,
	});

	// Undefined /= null
	expect(payment).not.toBeNull();
});
