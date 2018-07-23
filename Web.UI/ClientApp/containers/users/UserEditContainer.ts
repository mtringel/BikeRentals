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
import { StoreActionDispatch } from '../../store/actions/storeAction';
import { UserList } from '../../screens/users/UserList';
import { UsersActions } from '../../store/actions/users/usersActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { User } from '../../models/users/user';
import { RoleType } from '../../models/security/roleType';

const mapStateToProps: (state: RootState) => UserEditProps = state => {    
    var store = storeProvider();

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => UserEditActions = dispatch => {
    var store = storeProvider();
    var redirectBack = (isProfile: boolean) => store.dispatch(ClientContextActions.redirect(isProfile ? routeUrls.home() : routeUrls.users.list()));

    return {
        onAuthorize: (userId, isNewUser, onSuccess) => {
            store.dispatch(UsersActions.authorizeEdit(userId, isNewUser, onSuccess))
        },

        onAllowCachedData: (invalidateCaches: boolean) => {
            if (store.getState().clientContext.lastScreen instanceof UserList) return true;

            if (invalidateCaches) store.dispatch(UsersActions.invalidateRelevantCaches());
            return false;
        },

        // we need to get the list of roles, so we need to call the server anyway
        // userId is "new" for new users
        onLoad: (allowCachedData, userId, isNewUser, isProfile, onSuccess) => {
            if (isNewUser)
                onSuccess({ User: { ...new User(), Role: RoleType.User } });
            else
                store.dispatch(UsersActions.getById(
                    allowCachedData,
                    userId,
                    data => {
                        // ref.data is always cached, the list screen invalidates the cache at the beginning
                        onSuccess(data);
                    }));
        },

        onCancel: (user, isNewUser, isProfile) => redirectBack(isProfile),

        onSave: (user, isNewUser, isProfile) => {
            if (isNewUser)
                store.dispatch(UsersActions.post(user, true, () => redirectBack(isProfile)));
            else {
                store.dispatch(UsersActions.put(user, true, () => {
                    if (isProfile)
                        store.dispatch(AuthServiceActions.authorize(true, null, false, true)); // re-authenticate (name could have changed)

                    redirectBack(isProfile);
                }));
            }
        },

        onDelete: (user, isNewUser, isProfile) => {
            store.dispatch(UsersActions.delete(user.UserId, true, () => {
                if (isProfile)
                    store.dispatch(AuthServiceActions.logoff(() => store.dispatch(ClientContextActions.redirect(routeUrls.home()))));
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
