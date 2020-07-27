import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "./../services/password";
import { validateRequest, BadRequestError } from "@hjtickets/common";

const router = express.Router();
router.post(
	"/api/users/signin",
	[
		body("email")
			.isEmail()
			.withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("You must supply a password"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// Check user exist
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Invalid credentials");
		}

		// Check user password matches
		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);
		if (!passwordsMatch) {
			throw new BadRequestError("Invalid credentials");
		}

		// Log user in and send JWT
		// Generate JWT
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY! // exclamation mark reassures typescript
		);

		// Store in session object
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(existingUser);
	}
);

export { router as signinRouter };
