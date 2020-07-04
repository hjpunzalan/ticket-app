import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/notFoundError";

const app = express();
app.set("trust proxy", true); // ingress-nginx
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);

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
