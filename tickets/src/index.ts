import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}
	try {
		// Mongodb will create a database if we connect it to a new one
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error(error);
	}
	app.listen(3000, () => {
		console.log("Listening on port 3000!!!");
	});
};

start();
