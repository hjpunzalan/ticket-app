import request from "supertest";
import { app } from "../../app";

const createTicket = async () => {
	const title = "concert";
	const price = 20;
	return await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({ title, price })
		.expect(201);
};

test("it can fetch a list of tickets", async () => {
	const nTickets = 3;
	for (let i = 1; i <= nTickets; i++) {
		await createTicket();
	}

	const response = await request(app)
		.get("/api/tickets")
		.send()
		.expect(200);

	expect(response.body.length).toEqual(nTickets);
});
