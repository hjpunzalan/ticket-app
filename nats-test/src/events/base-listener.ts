import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

export abstract class Listener {
	// abstract properties to be defined in derived class
	abstract subject: Subjects;
	abstract queueGroupName: string;
	abstract onMessage(data: any, msg: Message): void;
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	subscriptionOptions() {
		// Set manual ack mode true
		// event is only completed only once acknowledged otherwise sent again
		// useful in case listeners goes down etc.
		// setDurableName tracks which event was processed and which hasnt
		// setDelivarableAllAvailable first time when creating subscription to track delivered events
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	listen() {
		//esablish listener to ticket:created channel
		// add into a queue group (persists durable name subscription @ restart)
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on("message", (msg: Message) => {
			// listen to any published message
			console.log(`Message received ${this.subject} / ${this.queueGroupName}`);

			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf-8"));
	}
}
