import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { Permission } from '../../models/security/permission';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { StoreDispatch } from '../../store/actions/storeAction';
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
import { StoreActions } from '../../store/actions/storeActions';
import { BikeEdit } from '../../screens/bikes/BikeEdit';


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

const mapDispatchToProps: (dispatch: StoreDispatch) => BikeListActions = dispatch => {
    return {
        onInit: (onSuccess) => {
            var lastScreen = storeProvider().getState().clientContext.lastScreen;

            // store.dispatch(BikesActions.clearState()) - keep cached data
            // Grid operations are always cached (order by, paging). Refresh buttons are never cached.
            StoreActions.clearStateIfExpiredAll(dispatch);

            dispatch(BikesActions.authorizeList(
                authContext => dispatch(ColorsActions.getList(true,
                    colors => dispatch(BikeModelsActions.getList(true,
                        bikeModels => onSuccess({
                            authContext: authContext,
                            initialLoadCached: true,
                            keepNavigation: lastScreen instanceof BikeList || lastScreen instanceof BikeEdit,
                            colors: colors.List,
                            bikeModels: bikeModels.List
                        })
                    ))
                )),
                error => dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        onLoad: (allowCachedData, filter, paging, onSuccess) => {
            if (!allowCachedData)
                dispatch(BikesActions.clearState());

            dispatch(
                BikesActions.getList(
                    allowCachedData,
                    filter,
                    paging,
                    storeProvider().getState().clientContext.currentLocation,
                    onSuccess
                ));
        },

        onViewRents: (bikeId, authContext) => {
            dispatch(BikeRentsActions.useBikeId(bikeId));

            if (authContext.canViewAllRents)
                dispatch(ClientContextActions.redirect(routeUrls.rents.listAll()));
            else if (authContext.canViewMyRents)
                dispatch(ClientContextActions.redirect(routeUrls.rents.listMy()));
        },

        onEdit: (bike) => dispatch(ClientContextActions.redirect(routeUrls.bikes.edit(bike.BikeId.toString()))),

        onAddNew: () => dispatch(ClientContextActions.redirect(routeUrls.users.new()))
    };
};

const BikeListContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(BikeList);

export default BikeListContainer;