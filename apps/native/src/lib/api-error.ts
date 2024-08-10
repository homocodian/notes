export class APIError extends Error {
  message: string;
  status: number;
  name: string;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = "APIError";
    this.url = url;
  }
}
