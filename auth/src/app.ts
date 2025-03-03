import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@hjtickets/common";

const app = express();
app.set("trust proxy", true); // ingress-nginx
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
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

export { app };
