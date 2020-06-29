import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

export class RequestValidationErorr extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super("Invalid request parameters"); // 'Error' breaks prototype chain here due to Typescript converting to ES2015

		// Only because we are extending a built in class
		Object.setPrototypeOf(this, RequestValidationErorr.prototype); // restore prototype chain
	}

	serializeErrors() {
		return this.errors.map((error) => {
			return { message: error.msg, field: error.param };
		});
	}
}
