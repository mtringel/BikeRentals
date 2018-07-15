import { StoreAction } from "../storeAction";
import { StoreActionType } from "../storeActionType";

export class LoginParamsActionsPayload{
    public readonly returnUrl: string;
    public readonly defaultEmail: string;
}

export class LoginParamsActions {

    public static setReturnUrl(url: string): StoreAction<Partial<LoginParamsActionsPayload>> {
        return {
            type: StoreActionType.LoginParams_SetReturnUrl,
            payload: {
                returnUrl: url
            }
        };
    }

    public static setDefaultEmail(email: string): StoreAction<Partial<LoginParamsActionsPayload>> {
        return {
            type: StoreActionType.LoginParams_SetDefaultEmail,
            payload: {
                defaultEmail: email
            }
        };
    }
}