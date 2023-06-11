//error tpe used in validating input before database entry
export class InvalidDataError extends Error {
	status: number;
	message: string;
	cause: string;

	constructor({ status, message, cause }: { status: number; message: string; cause: string }) {
		super();
		this.status = status;
		this.message = message;
		this.cause = cause;
	}
}
