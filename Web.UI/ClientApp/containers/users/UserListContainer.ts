import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { UserListProps, UserListActions, UserList } from '../../screens/users/UserList';
import { Permission } from '../../models/security/permission';
import { UserListData } from '../../models/users/userListData';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { User } from '../../models/users/user';
import { UserAuthContext } from '../../models/users/userAuthContext';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { ClientContextState } from '../../store/state/shared/clientContextState';
import { UserEdit } from '../../screens/users/UserEdit';
import { StoreDispatch } from '../../store/actions/storeAction';
import { TypeHelper } from '../../helpers/typeHelper';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { UsersActions } from '../../store/actions/users/usersActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';
import { StoreActions } from '../../store/actions/storeActions';


const mapStateToProps: (state: RootState) => UserListProps = state => {    
    var store = storeProvider();
    var rootState = store.getState();
    var lastScreen = rootState.clientContext.lastScreen;

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreDispatch) => UserListActions = dispatch => {

    return {
        onInit: (onSuccess) => {
            let lastScreen = storeProvider().getState().clientContext.lastScreen;

            // store.dispatch(UsersActions.clearState()); - keep cached data
            StoreActions.clearStateIfExpiredAll(dispatch);

            // get auth.info
            dispatch(UsersActions.authorizeList(
                // Grid operations are always cached (order by, paging). Refresh buttons are never cached.
                authContext => onSuccess({
                    authContext: authContext,
                    initialLoadCached: true,
                    keepNavigation: lastScreen instanceof UserEdit || lastScreen instanceof UserList
                }),
                error => dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        onLoad: (allowCachedData, filter, onSuccess) => {
            dispatch(UsersActions.getList(
                allowCachedData,
                filter,
                result => {
                    ArrayHelper.sortByPredicate(result.List, t => [t.LastName, t.FirstName, t.Email]);
                    onSuccess(result);
                }))
        },

        onEdit: (user) => dispatch(ClientContextActions.redirect(routeUrls.users.edit(user.UserId))),

        onAddNew: () => dispatch(ClientContextActions.redirect(routeUrls.users.new()))
    };
};

const UserListContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(UserList);

export default UserListContainer;
