import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { Permission } from '../../models/security/permission';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { ClientContextState } from '../../store/state/shared/clientContextState';
import { StoreDispatch } from '../../store/actions/storeAction';
import { UserList } from '../../screens/users/UserList';
import { UsersActions } from '../../store/actions/users/usersActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { BikeEditProps, BikeEditActions, BikeEdit } from '../../screens/bikes/BikeEdit';
import { BikesActions } from '../../store/actions/bikes/bikesActions';
import { ColorsActions } from '../../store/actions/master/colorsActions';
import { BikeModelsActions } from '../../store/actions/bikes/bikeModelsActions';
import { Bike } from '../../models/bikes/bike';
import { StoreActions } from '../../store/actions/storeActions';

const mapStateToProps: (state: RootState) => BikeEditProps = state => {    
    var store = storeProvider();    

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreDispatch) => BikeEditActions = dispatch => {
    var redirectBack = () => dispatch(ClientContextActions.redirect(routeUrls.bikes.list()));

    return {
        onInit: (bikeId, isNewBike, onSuccess) => {
            //store.dispatch(UsersActions.clearState()); - keep cached data
            StoreActions.clearStateIfExpiredAll(dispatch);

            dispatch(BikesActions.authorizeEdit(bikeId, isNewBike,
                authContext => dispatch(ColorsActions.getList(true,
                    colors => dispatch(BikeModelsActions.getList(true,
                        bikeModels => onSuccess({
                            authContext: authContext,
                            initialLoadCached: true,
                            colors: colors.List,
                            bikeModels: bikeModels.List
                        })
                    ))
                )),
                error => dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        // we need to get the list of roles, so we need to call the server anyway
        // userId is "new" for new users
        onLoad: (allowCachedData, bikeId, isNewBike, onSuccess) => {
            if (isNewBike)
                onSuccess({ Bike: new Bike() });
            else
                dispatch(BikesActions.getById(allowCachedData, bikeId, onSuccess));
        },

        onCancel: (bike, isNewBike) => redirectBack(),

        onSave: (bike, isNewBike) => {
            if (isNewBike)
                dispatch(BikesActions.post(bike, true, storeProvider().getState().clientContext.currentLocation, () => redirectBack()));
            else
                dispatch(BikesActions.put(bike, true, () => redirectBack()));
        },

        onDelete: (bike, isNewBike) => {
            dispatch(BikesActions.delete(bike.BikeId, true, () => redirectBack()));
        }
    };
};

const BikeEditContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(BikeEdit);

export default BikeEditContainer;
