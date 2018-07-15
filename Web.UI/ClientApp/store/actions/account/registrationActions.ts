import { StoreAction, IStoreAction } from "../storeAction";
import { StoreActionType } from "../storeActionType";
import { RegisterData } from "../../../models/account/registerData";
import { RootState } from "../../state/rootState";
import { WebApiServiceActions } from "../../actions/shared/webApiServiceActions";

const serviceUrl = "api/registration";

export class LoginParamsActionsPayload{
    public readonly returnUrl: string;
    public readonly defaultEmail: string;
}

export class RegistrationActions {

    public static register(data: RegisterData, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.post<any>(serviceUrl, data, false, onSuccess));
        };
    }
}