import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { Permission } from '../../models/security/permission';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { StoreActionDispatch } from '../../store/actions/storeAction';
import { TypeHelper } from '../../helpers/typeHelper';
import { BikeListProps, BikeListActions, BikeList } from '../../screens/bikes/BikeList';
import { BikeListFilter } from '../../models/bikes/bikeListFilter';
import { DateHelper } from '../../helpers/dateHelper';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { BikesActions } from '../../store/actions/bikes/bikesActions';
import { BikeModelsActions } from '../../store/actions/bikes/bikeModelsActions';
import { ColorsActions } from '../../store/actions/master/colorsActions';
import { BikeRentsActions } from '../../store/actions/rents/bikeRentsActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';


const mapStateToProps: (state: RootState) => BikeListProps = state => {
    var store = storeProvider();
    var rootState = store.getState();
    var now = DateHelper.setDateParts(DateHelper.now(), { minutes: 0, seconds: 0, milliseconds: 0 }); // can't cache if filter changes every seconds

    return {
        store: store,
        defaultFilter: {
            ...new BikeListFilter(),
            CurrentLocation: rootState.clientContext.currentLocation,
            AvailableUtc: { From: now, To: DateHelper.addHours(now, 1) }
        },
        defaultOrderBy: ["DistanceMiles"],
        defaultOrderByDescending: false
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => BikeListActions = dispatch => {
    var store = storeProvider();

    return {
        onInit: (onSuccess) => {
            var lastScreen = store.getState().clientContext.lastScreen;

            // store.dispatch(BikesActions.clearState()) - keep cached data
            store.clearStateIfExpiredAll();

            store.dispatch(BikesActions.authorizeList(
                // Grid operations are always cached (order by, paging), this controls initial load. Refresh buttons are never cached.
                authContext => onSuccess({
                    authContext: authContext,
                    initialLoadCached: true,
                    keepNavigation: lastScreen instanceof BikeList, // TODO: || lastScreen instanceof BikeEdit
                }),
                error => store.dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        onLoad: (allowCachedData, filter, paging, onSuccess) => store.dispatch(
            BikesActions.getList(
                allowCachedData,
                filter,
                paging,
                store.getState().clientContext.currentLocation,
                onSuccess
            )),

        onLoadFilter: (onSuccess) => {
            store.dispatch(ColorsActions.getList(true, colors => {
                store.dispatch(BikeModelsActions.getList(true, models => {
                    onSuccess(colors.List, models.List);
                }));
            }));
        },

        onViewRents: (bikeId, authContext) => {
            store.dispatch(BikeRentsActions.useBikeId(bikeId));

            if (authContext.canViewAllRents)
                store.dispatch(ClientContextActions.redirect(routeUrls.rents.listAll()));
            else if (authContext.canViewMyRents)
                store.dispatch(ClientContextActions.redirect(routeUrls.rents.listMy()));
        },

        //onEdit: (filter, user) => store.redirect(routeUrls.users.edit(user.BikeId)),

        //onAddNew: (filter) => store.redirect(routeUrls.users.new())
    };
};

const BikeListContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(BikeList);

export default BikeListContainer;