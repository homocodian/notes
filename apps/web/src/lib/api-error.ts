export class APIError extends Error {
  message: string;
  status: number;
  name: string;

  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = "APIError";
  }
}
