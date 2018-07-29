import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ColorsState } from '../../state/master/colorsState';
import { Color } from '../../../models/master/color';
import { ColorsActionsPayload } from '../../actions/master/colorsActions';
import { DateHelper } from '../../../helpers/dateHelper';
import { TypeHelper } from '../../../helpers/typeHelper';

export const ColorsReducers: (state: ColorsState, action: StoreAction<ColorsActionsPayload>) => ColorsState =
    (state = new ColorsState(), action) => {

        switch (action.type) {
            case StoreActionType.Colors_SetListData:
                return {
                    ...state,
                    cache: state.cache.setListData(state.cache.EmptyFilter, action.payload.listData),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };

            case StoreActionType.Colors_ClearState:
                return new ColorsState();

            default:
                return state;
        }
    };