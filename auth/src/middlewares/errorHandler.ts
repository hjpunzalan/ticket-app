import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "./../errors/databaseConnectionError";
import { RequestValidationErorr } from "./../errors/requestValidationErrors";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof RequestValidationErorr) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	if (err instanceof DatabaseConnectionError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}

	res.status(400).send({
		message: [{ message: "Something went wrong" }],
	});
};
