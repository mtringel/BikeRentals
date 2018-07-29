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
import { StoreActionDispatch } from '../../store/actions/storeAction';
import { TypeHelper } from '../../helpers/typeHelper';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { UsersActions } from '../../store/actions/users/usersActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';


const mapStateToProps: (state: RootState) => UserListProps = state => {    
    var store = storeProvider();
    var rootState = store.getState();
    var lastScreen = rootState.clientContext.lastScreen;

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => UserListActions = dispatch => {
    var store = storeProvider();

    return {
        onInit: (onSuccess) => {
            let lastScreen = store.getState().clientContext.lastScreen;

            // store.dispatch(UsersActions.clearState()); - keep cached data
            store.clearStateIfExpiredAll();

            // get auth.info
            store.dispatch(UsersActions.authorizeList(
                // Grid operations are always cached (order by, paging), this controls initial load. Refresh buttons are never cached.
                authContext => onSuccess({
                    authContext: authContext,
                    initialLoadCached: true,
                    keepNavigation: lastScreen instanceof UserEdit || lastScreen instanceof UserList
                }),
                error => store.dispatch(AuthServiceActions.redirectToLoginPageIfNeeded())
            ))
        },

        onLoad: (allowCachedData, filter, onSuccess) => {
            store.dispatch(UsersActions.getList(
                allowCachedData,
                filter,
                result => {
                    ArrayHelper.sortByPredicate(result.List, t => [t.LastName, t.FirstName, t.Email]);
                    onSuccess(result);
                }))
        },

        onEdit: (filter, user) => store.dispatch(ClientContextActions.redirect(routeUrls.users.edit(user.UserId))),

        onAddNew: (filter) => store.dispatch(ClientContextActions.redirect(routeUrls.users.new()))
    };
};

const UserListContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(UserList);

export default UserListContainer;
