import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@hjtickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // ingress-nginx
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);

app.use(currentUser);

// Routes
app.use(createChargeRouter);

app.all("*", () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
