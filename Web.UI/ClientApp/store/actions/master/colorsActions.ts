
import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { Store } from '../../store';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { Color } from '../../../models/master/color';
import { ColorsState } from '../../state/master/colorsState';
import { ColorListData } from '../../../models/master/colorListData';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';

const ServiceUrl = "api/colors";

export class ColorsActionsPayload {
    public readonly colors: Color[];
}

export class ColorsActions {

    public static getList(allowCachedData: boolean, onSuccess: (data: ColorListData) => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().colors.colors;

                if (!ArrayHelper.isNullOrEmpty(data)) {
                    // return from store
                    onSuccess({ List: data });
                } else {
                    // return from server (updates store)
                    dispatch(ColorsActions.getList(false, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<ColorListData>(
                    ServiceUrl,
                    result => {
                        dispatch(ColorsActions.setListData(result));
                        onSuccess(result);
                    }));
            }
        }
    }

    private static setListData(data: ColorListData): StoreAction<Partial<ColorsActionsPayload>> {
        return {
            type: StoreActionType.Colors_SetListData,
            payload: {
                colors: data.List
            }
        };
    }

    private static clearState(): StoreAction<ColorsActionsPayload> {
        return {
            type: StoreActionType.Colors_ClearState,
            payload: null
        };
    }

    public static invalidateRelevantCaches(): StoreActionThunk {

        return (dispatch, getState) => {
            dispatch(ColorsActions.clearState());
        };
    }
}