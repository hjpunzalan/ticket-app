import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
	namespace NodeJS {
		interface Global {
			signin(): Promise<string[]>;
		}
	}
}

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = "asdsa";
	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

// global scoped function for ease
global.signin = async () => {
	const email = "test@test.com";
	const password = "password";

	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email,
			password,
		})
		.expect(201);

	const cookie = response.get("Set-Cookie");

	return cookie;
};
