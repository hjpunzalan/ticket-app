import request from "supertest";
import { app } from "../../app";

describe("Valid sign up", () => {
	test("sets a cookie after signup", async () => {
		const response = await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);

		// get() built-in method to get headers from response
		expect(response.get("Set-Cookie")).toBeDefined();
	});

	test("returns a 201 on successful signup", async () => {
		return request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);
	});
});

describe("Invalid sign up", () => {
	test("returns a 400 with an invalid  email", async () => {
		return request(app)
			.post("/api/users/signup")
			.send({
				email: "test",
				password: "password",
			})
			.expect(400);
	});

	test("returns a 400 with an invalid  password", async () => {
		return request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "p",
			})
			.expect(400);
	});

	test("returns a 400 with missing email and password", async () => {
		await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
			})
			.expect(400);

		await request(app)
			.post("/api/users/signup")
			.send({
				password: "p",
			})
			.expect(400);
	});

	test("forbids duplicate emails", async () => {
		await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(201);

		await request(app)
			.post("/api/users/signup")
			.send({
				email: "test@test.com",
				password: "password",
			})
			.expect(400);
	});
});
