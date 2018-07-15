import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ColorsState } from '../../state/master/colorsState';
import { Color } from '../../../models/master/color';
import { ColorsActionsPayload } from '../../actions/master/colorsActions';

export const ColorsReducers: (state: ColorsState, action: StoreAction<ColorsActionsPayload>) => ColorsState =
    (state = new ColorsState(), action) => {

        switch (action.type) {
            case StoreActionType.Colors_SetListData:
                return { colors: action.payload.colors };

            case StoreActionType.Colors_ClearState:
                return { colors: null };

            default:
                return state;
        }
    };