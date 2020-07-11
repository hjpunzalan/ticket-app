import request from "supertest";
import { app } from "../../app";

test("clears cookie after signing out", async () => {
	let response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);
	expect(response.get("Set-Cookie")).toBeDefined();

	response = await request(app)
		.post("/api/users/signout")
		.expect(200);
	expect(response.get("Set-Cookie")[0]).toEqual(
		"express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
	);
});
