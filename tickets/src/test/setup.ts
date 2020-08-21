import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
		}
	}
}

let mongo: any;

// Use mock nats wrapper for all test
jest.mock("../nats-wrapper");

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
global.signin = () => {
	// Build a JWT payload. { id, email}
	const payload = {
		id: mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};

	// Create a JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build a session.object. { jwt: MY_JWT}
	const session = { jwt: token };
	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);
	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");

	//return a string thats the cookie with the encoded data
	return [`express:sess=${base64}`];
};
