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


const mapStateToProps: (state: RootState) => BikeListProps  = state => {    
    var store = storeProvider();
    var rootState = store.getState();
    var now = DateHelper.now();

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
    var rootState = store.getState();

    return {
        onAuthorize: (onSuccess) => store.dispatch(BikesActions.authorizeList(
            onSuccess,
            error => store.dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
        )),

        onAllowCachedData: (invalidateCaches: boolean) => {
            var lastScreen = store.getState().clientContext.lastScreen;
            if (lastScreen instanceof BikeList) return true; // TODO || lastScreen instanceof UserList;

            if (invalidateCaches) store.dispatch(BikesActions.invalidateRelevantCaches())
            return false;
        },

        onLoad: (allowCachedData, filter, paging, onSuccess) => store.dispatch(BikesActions.getList(allowCachedData, filter, paging, rootState.clientContext.currentLocation, onSuccess)),

        onLoadFilter: (allowCachedData, onSuccess) => {
            store.dispatch(ColorsActions.getList(allowCachedData, colors => {
                store.dispatch(BikeModelsActions.getList(allowCachedData, models => {
                    onSuccess(colors.List, models.List);
                }));
            }));
        },

        onViewRents: (bikeId) => {
            store.dispatch(BikeRentsActions.useBikeId(bikeId));
            store.dispatch(ClientContextActions.redirect(routeUrls.rents.listAll()));
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
