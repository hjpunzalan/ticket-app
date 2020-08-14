import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear;

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
	url: "http://localhost:4222",
});
stan.on("connect", () => {
	console.log("Listener connected to nats");

	// Graceful client shutdown
	stan.on("close", () => {
		console.log("NATS connection closed!");
		process.exit();
	});

	// Set manual ack mode true
	// event is only completed only once acknowledged otherwise sent again
	// useful in case listeners goes down etc.
	const options = stan
		.subscriptionOptions()
		.setManualAckMode(true)
		.setDeliverAllAvailable();

	//esablish listener to ticket:created channel
	// add into a queue group
	const subscription = stan.subscribe("ticket:created", options);

	// listen to any published message
	subscription.on("message", (msg: Message) => {
		const data = msg.getData();

		if (typeof data === "string") {
			console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
		}
		msg.ack();
	});
});

// Terminating program closes client first
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
