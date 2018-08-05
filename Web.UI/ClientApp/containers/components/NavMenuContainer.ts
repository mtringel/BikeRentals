import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { storeProvider } from '../../boot';
import { StoreDispatch } from '../../store/actions/storeAction';
import { NavMenuProps, NavMenuActions, NavMenu } from '../../components/NavMenu';
import { routeUrls } from '../../routes';
import { NavMenuActions as NavMenuStoreActions } from '../../store/actions/shared/navMenuActions';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';

const mapStateToProps: (state: RootState) => Partial<NavMenuProps> = state => {
    var store = storeProvider();

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreDispatch) => NavMenuActions = dispatch => {
    var store = storeProvider();

    return {
        onAuthorize: (onSuccess) => store.dispatch(NavMenuStoreActions.authorize(onSuccess)),

        onLogOff: (onSuccess) => store.dispatch(AuthServiceActions.logoff(
            () => {
                store.dispatch(ClientContextActions.redirect(routeUrls.home()));
                onSuccess();
            }))
    };
};

const NavMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavMenu);

export default NavMenuContainer;
