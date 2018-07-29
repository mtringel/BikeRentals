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
    var now = DateHelper.setDateParts(DateHelper.now(), { minutes: 0, seconds: 0, milliseconds: 0 }); // can't cache if filter changes every seconds

    return {
        store: store,
        defaultFilter: {
            ...new BikeRentListFilter(),
            BikeId: rootState.bikeRents.param_BikeId
        },
        defaultOrderBy: ["StartDateUtc", "EndDateUtc"],
        defaultOrderByDescending: false,
        myRentsOnly: myRentsOnly
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => BikeRentListActions = dispatch => {
    var store = storeProvider();

    return {
        onInit: (onSuccess) => {
            let lastScreen = store.getState().clientContext.lastScreen;

            //store.dispatch(BikeRentsActions.clearState()); - keep cached data
            store.clearStateIfExpiredAll();

            store.dispatch(BikeRentsActions.authorizeList(
                // Grid operations are always cached (order by, paging), this controls initial load. Refresh buttons are never cached.
                authContext => onSuccess({
                    authContext: authContext,
                    initialLoadCached: true,
                    keepNavigation: lastScreen instanceof BikeRentList, // TODO: || lastScreen instanceof BikeRentEdit,
                }),
                error => store.dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        onLoad: (allowCachedData, filter, paging, onSuccess) => store.dispatch(BikeRentsActions.getList(allowCachedData, filter, paging, onSuccess)),

        onLoadFilter: (onSuccess) => {
            store.dispatch(ColorsActions.getList(true, colors => {
                store.dispatch(BikeModelsActions.getList(true, models => {
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
