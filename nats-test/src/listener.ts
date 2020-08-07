import nats from "node-nats-streaming";

console.clear;

const stan = nats.connect("ticketing", "123", {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Listener connected to nats");

	//esablish listener to ticket:created channel
	const subscription = stan.subscribe("ticket:created");

	subscription.on("message", () => {
		console.log("Message received");
	});
});
