import { ValidationError } from "express-validator";

export class RequestValidationErorr extends Error {
	constructor(public errors: ValidationError[]) {
		super(); // 'Error' breaks prototype chain here due to Typescript converting to ES2015

		// Only because we are extending a built in class
		Object.setPrototypeOf(this, RequestValidationErorr.prototype); // restore prototype chain
	}
}
