import { ResourceType } from "./resourceType";

export class GlobalParameters { 

    public readonly IsDebugging: boolean;

    public readonly ProductTitle: string;

    public readonly GridPageSize: number = 0;

    public readonly GridMaxRows : number = 0;

    public readonly ShortDateFormat: string;

    public readonly ShortDateTimeFormat: string;

    public readonly ShowDetailedError: boolean;

    public readonly AntiforgeryTokenHeaderName: string;

    public readonly AntiforgeryTokenFieldName: string; 

    public readonly BasePath: string;

    public readonly BaseUrl: string;

    // Auto login
    public readonly AutoLoginEmail: string;

    public readonly AutoLoginPassword: string;

    // Resource
    private _resources: { [key: string]: string } = {};

    public resource(
        resource: ResourceType,
        param1?: string | undefined | null,
        param2?: string | undefined | null,
        param3?: string | undefined | null,
        param4?: string | undefined | null,
        param5?: string | undefined | null): string {

        var res = this._resources[resource];

        if (param1 !== null)
            res = res.replace('{0}', param1);

        if (param2 !== null)
            res = res.replace('{1}', param2);

        if (param3 !== null)
            res = res.replace('{2}', param3);

        if (param4 !== null)
            res = res.replace('{3}', param4);

        if (param5 !== null)
            res = res.replace('{4}', param5);

        return res;
    }

    public constructor(globalsElement?: any | undefined | null) {
        // super();

        if (globalsElement !== undefined && globalsElement !== null) {
            this.IsDebugging = globalsElement.isDebugging;
            this.ProductTitle = globalsElement.productTitle;
            this.GridPageSize = globalsElement.gridPageSize;
            this.GridMaxRows = globalsElement.gridMaxRows;
            this.ShortDateFormat = globalsElement.shortDateFormat;
            this.ShortDateTimeFormat = globalsElement.shortDateTimeFormat;
            this.ShowDetailedError = globalsElement.showDetailedError;
            this.AntiforgeryTokenHeaderName = globalsElement.antiforgeryTokenHeaderName;
            this.AntiforgeryTokenFieldName = globalsElement.antiforgeryTokenFieldName; 
            this.BasePath = globalsElement.basePath;
            this.BaseUrl = globalsElement.baseUrl;

            // Auto login
            this.AutoLoginEmail = globalsElement.autoLoginEmail;
            this.AutoLoginPassword = globalsElement.autoLoginPassword;

            this._resources = globalsElement.resources;
        }
    }
}