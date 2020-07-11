import request from "supertest";
import { app } from "../../app";

describe("Invalid sign in", () => {
	test("fails when a email that does not exist is supplied", async () => {
		await request(app)
			.post("/api/users/signin")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(400);
	});

	test("fails when incorrect password is supplied", async () => {
		await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);

		await request(app)
			.post("/api/users/signin")
			.send({
				email: "test@test.com",
				password: "passdsadsword",
			})
			.expect(400);
	});
});

describe("Valid sign in", () => {
	test("responds with a cookie when given valid credentials", async () => {
		await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);

		const response = await request(app)
			.post("/api/users/signin")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);

		expect(response.get("Set-Cookie")).toBeDefined();
	});
});
