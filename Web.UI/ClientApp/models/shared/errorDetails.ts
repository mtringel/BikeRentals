export class ErrorDetails
{
    public readonly Message: string ;

    public readonly ErrorDetails: string ;

    public constructor(message: string, messageDetails?: string | undefined | null) {
        this.Message = message;
        this.ErrorDetails = messageDetails;
    }
}
    