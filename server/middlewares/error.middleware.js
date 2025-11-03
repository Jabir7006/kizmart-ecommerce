import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const notFound = (_req, _res, next) => {
	const error = new ApiError(404, "Route not found");
	next(error);
};

const errorHandler = (err, _req, res, _next) => {
	console.error("ERROR:", err);

	let statusCode = 500;
	let message = "Internal Server Error";
	let errors = [];

	// 1. Handle known, custom ApiErrors
	if (err instanceof ApiError) {
		statusCode = err.statusCode;
		message = err.message;
		errors = err.errors;
	}

	// 2. Handle Zod validation errors
	else if (err instanceof ZodError) {
		statusCode = 400;
		message = "Validation failed";
		errors = err.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));
	}

	// 3. Handle Mongoose Bad ObjectId Error
	else if (err.name === "CastError" && err.kind === "ObjectId") {
		statusCode = 400;
		message = `Invalid ID format for resource at path: ${err.path}`;
		errors = [{ path: err.path, value: err.value }];
	} else if (err.code === 11000) {
		statusCode = 409; // 409 Conflict

		if (
			err.keyValue &&
			typeof err.keyValue === "object" &&
			Object.keys(err.keyValue).length > 0
		) {
			const field = Object.keys(err.keyValue)[0];
			const value = err.keyValue[field];
			message = `Duplicate value error: A record with this ${field} (${value}) already exists.`;
			errors = [{ [field]: value }];
		} else {
			message = "Duplicate value error";
			errors = [];
		}
	} else {
		statusCode = 500;
		message = "Internal Server Error";
		errors = [];

		if (process.env.NODE_ENV !== "production") {
			errors.push({
				error: err.message,
				stack: err.stack,
			});
		}
	}

	return res
		.status(statusCode)
		.json(new ApiResponse(statusCode, message, errors));
};

export { errorHandler, notFound };
