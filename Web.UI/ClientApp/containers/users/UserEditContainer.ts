import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { StringHelper } from '../../helpers/stringHelper';
import { UserEditProps, UserEditActions, UserEdit } from '../../screens/users/UserEdit';
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
import { User } from '../../models/users/user';
import { RoleType } from '../../models/security/roleType';
import { StoreActions } from '../../store/actions/storeActions';

const mapStateToProps: (state: RootState) => UserEditProps = state => {    
    var store = storeProvider();    

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreDispatch) => UserEditActions = dispatch => {
    var redirectBack = (isProfile: boolean) => dispatch(ClientContextActions.redirect(isProfile ? routeUrls.home() : routeUrls.users.list()));

    return {
        onInit: (userId, isNewUser, onSuccess) => {
            //store.dispatch(UsersActions.clearState()); - keep cached data
            StoreActions.clearStateIfExpiredAll(dispatch);

            dispatch(UsersActions.authorizeEdit(userId, isNewUser,
                // Grid operations are always cached (order by, paging). Refresh buttons are never cached.
                authContext => onSuccess({
                    authContext: authContext,
                    initialLoadCached: true
                })));
        },

        // we need to get the list of roles, so we need to call the server anyway
        // userId is "new" for new users
        onLoad: (allowCachedData, userId, isNewUser, isProfile, onSuccess) => {
            if (isNewUser)
                onSuccess({ User: { ...new User(), Role: RoleType.User } });
            else
                dispatch(UsersActions.getById(allowCachedData, userId, onSuccess));
        },

        onCancel: (user, isNewUser, isProfile) => redirectBack(isProfile),

        onSave: (user, isNewUser, isProfile) => {
            if (isNewUser)
                dispatch(UsersActions.post(user, true, () => redirectBack(isProfile)));
            else {
                dispatch(UsersActions.put(user, true, () => {
                    if (isProfile)
                        dispatch(AuthServiceActions.authorize(true, null, false, true)); // re-authenticate (name could have changed)

                    redirectBack(isProfile);
                }));
            }
        },

        onDelete: (user, isNewUser, isProfile) => {
            dispatch(UsersActions.delete(user.UserId, true, () => {
                if (isProfile)
                    dispatch(AuthServiceActions.logoff(() => dispatch(ClientContextActions.redirect(routeUrls.home()))));
                else
                    redirectBack(false);
            }));
        }
    };
};

const UserEditContainer = connect(
     mapStateToProps,
    mapDispatchToProps
)(UserEdit);

export default UserEditContainer;
