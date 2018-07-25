import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { Permission } from '../../models/security/permission';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { ClientContextState } from '../../store/state/shared/clientContextState';
import { StoreActionDispatch } from '../../store/actions/storeAction';
import { TypeHelper } from '../../helpers/typeHelper';
import { BikeRentListProps, BikeRentListActions, BikeRentList } from '../../screens/rents/BikeRentList';
import { BikeRentListFilter } from '../../models/rents/bikeRentListFilter';
import { DateHelper } from '../../helpers/dateHelper';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { BikesActions } from '../../store/actions/bikes/bikesActions';
import { BikeModelsActions } from '../../store/actions/bikes/bikeModelsActions';
import { ColorsActions } from '../../store/actions/master/colorsActions';
import { BikeRentsActions } from '../../store/actions/rents/bikeRentsActions';


const mapStateToProps: (state: RootState, myRentsOnly: boolean) => BikeRentListProps = (state, myRentsOnly) => {    
    var store = storeProvider();
    var rootState = store.getState();
    var now = DateHelper.now();

    return {
        store: store,
        defaultFilter: {
            ...new BikeRentListFilter(),
            BikeId: rootState.bikeRents.useBikeId
        },
        defaultOrderBy: ["StartDateUtc", "EndDateUtc"],
        defaultOrderByDescending: false,
        myRentsOnly: myRentsOnly
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => BikeRentListActions = dispatch => {
    var store = storeProvider();
    var rootState = store.getState();

    return {
        onAuthorize: (onSuccess) => store.dispatch(BikeRentsActions.authorizeList(
            onSuccess,
            error => store.dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
        )),

        onAllowCachedData: (invalidateCaches: boolean) => {
            var lastScreen = store.getState().clientContext.lastScreen;
            if (lastScreen instanceof BikeRentList) return true; // TODO || lastScreen instanceof UserList;

            if (invalidateCaches) store.dispatch(BikeRentsActions.invalidateRelevantCaches())
            return false;
        },

        onLoad: (allowCachedData, filter, paging, onSuccess) => store.dispatch(BikeRentsActions.getList(allowCachedData, filter, paging, onSuccess)),

        onLoadFilter: (allowCachedData, onSuccess) => {
            store.dispatch(ColorsActions.getList(allowCachedData, colors => {
                store.dispatch(BikeModelsActions.getList(allowCachedData, models => {
                    onSuccess(colors.List, models.List);
                }));
            }));
        }

        //onEdit: (filter, user) => store.redirect(routeUrls.users.edit(user.BikeId)),

        //onAddNew: (filter) => store.redirect(routeUrls.users.new())
    };
};

// My Rents
const BikeRentListContainer = {
    MyRents: connect(t => mapStateToProps(t, true), mapDispatchToProps)(BikeRentList),
    AllRents: connect(t => mapStateToProps(t, false), mapDispatchToProps)(BikeRentList)
};

export default BikeRentListContainer;
