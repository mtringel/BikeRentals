export class WebApiServiceState {

    /// <summary>
    /// Antiforgery works with form token + cookie token.
    /// Since the cookie can only hold the last token, we keep the last form token only.
    /// </summary>
    public readonly lastAntiforgeryToken: string = null;

    /// <summary>
    /// Currently executing asynchronous requests.
    /// Key is all requests parameters and data serialized.
    /// Value is all onSuccess/onError callbacks that must be called when the request is completed.
    /// Used to eliminate parallel requests for the same resource.
    /// </summary>
    public readonly activeRequests: { [key: string]: { onSuccess: (result: any) => void, onError: (error: Error) => void }[] } = {};
}