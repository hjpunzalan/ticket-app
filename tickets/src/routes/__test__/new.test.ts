import request from "supertest";
import { app } from "../../app";

test("has a route handler listening to /api/tickets for post requests", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.send({});

	expect(response.status).not.toEqual(404);
});

test("can only be access if the user is signed in", () => {});

test("returns an error if an invalid title is provided", () => {});

test("creates a ticket with valid inputs", () => {});
