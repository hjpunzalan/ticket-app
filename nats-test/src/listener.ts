import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear;

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Listener connected to nats");

	// Set manual ack mode true
	// event is only completed only once acknowledged otherwise sent again
	// useful in case listeners goes down etc.
	const options = stan.subscriptionOptions().setManualAckMode(true);

	//esablish listener to ticket:created channel
	// add into a queue group
	const subscription = stan.subscribe(
		"ticket:created",
		"orders-service-queue-group",
		options
	);

	// listen to any published message
	subscription.on("message", (msg: Message) => {
		const data = msg.getData();

		if (typeof data === "string") {
			console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
		}
		msg.ack();
	});
});
