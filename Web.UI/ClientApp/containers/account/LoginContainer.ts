import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { Login, LoginProps, LoginActions } from '../../screens/account/Login';
import { LoginData } from '../../models/account/loginData';
import { StringHelper } from '../../helpers/stringHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { ClientContextState } from '../../store/state/shared/clientContextState';
import { StoreActionDispatch } from '../../store/actions/storeAction';
import { AuthServiceActions } from '../../store/actions/security/authServiceActions';
import { LoginParamsActions } from '../../store/actions/account/loginParamsActions';

const mapStateToProps: (state: RootState) => LoginProps = state => {
    var store = storeProvider();
    
    return {
        store: store,
        returnUrl: state.loginParams.returnUrl,
        email: state.loginParams.defaultEmail
    };
};

const mapDispatchToProps: (dispatch: StoreActionDispatch) => LoginActions = dispatch => {
    var store = storeProvider();
    var rootState = store.getState();

    return {
        onSubmit: (data, returnUrl) => {
            store.dispatch(AuthServiceActions.login(
                data,
                user => {
                    store.dispatch(LoginParamsActions.setDefaultEmail(data.Email));
                    rootState.clientContext.activeScreen.redirect(StringHelper.notNullOrEmpty(returnUrl, routeUrls.home()));
                }))
        }
    };
};

const LoginContainer = connect(
     mapStateToProps,
     mapDispatchToProps
)(Login);

export default LoginContainer;
