import { ValidationError } from "express-validator";

export class RequestValidationErorr extends Error {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super(); // 'Error' breaks prototype chain here due to Typescript converting to ES2015

		// Only because we are extending a built in class
		Object.setPrototypeOf(this, RequestValidationErorr.prototype); // restore prototype chain
	}

	serializeErrors() {
		return this.errors.map((error) => {
			return { message: error.msg, field: error.param };
		});
	}
}
