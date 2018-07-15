import { StoreAction, IStoreAction } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { RolesState } from '../../state/security/rolesState';
import { RoleListData } from '../../../models/security/roleListData';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';

const ServiceUrl = "api/roles";

export class RolesActionsPayload {
    public readonly roles: KeyValuePair<RoleType, string>[];
}

export class RolesActions {

    public static getList(allowCachedData: boolean, onSuccess: (data: RoleListData) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().roles.roles;

                if (!ArrayHelper.isNullOrEmpty(data)) {
                    // return from store
                    onSuccess({ List: data });
                } else {
                    // return from server (updates store)
                    dispatch(RolesActions.getList(false, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<RoleListData>(
                    ServiceUrl,
                    result => {
                        dispatch(RolesActions.setListData(result));
                        onSuccess(result);
                    }));
            }
        }
    }

    private static setListData(data: RoleListData): StoreAction<Partial<RolesActionsPayload>> {
        return {
            type: StoreActionType.Roles_SetListData,
            payload: {
                roles: data.List
            }
        };
    }

    public static clearState(): StoreAction<RolesActionsPayload> {
        return {
            type: StoreActionType.Roles_ClearState,
            payload: null
        };
    }
}