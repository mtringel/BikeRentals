import { HttpStatusCode } from "./httpStatusCode";

export class WebApiResult<T>
{
    public readonly StatusCode: HttpStatusCode;

    public readonly Data: T;

    public constructor(status: HttpStatusCode, data?: T | undefined | null) {
        this.StatusCode = status;
        this.Data = data;
    }
}
    