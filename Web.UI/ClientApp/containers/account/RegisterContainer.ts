import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/state/rootState';
import { Register, RegisterActions, RegisterProps } from '../../screens/account/Register';
import { RegisterData } from '../../models/account/registerData';
import { routeUrls } from '../../routes';
import { storeProvider } from '../../boot';
import { StoreDispatch } from '../../store/actions/storeAction';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';
import { RegistrationActions } from '../../store/actions/account/registrationActions';
import { Login } from '../../screens/account/Login';
import { LoginParamsActions } from '../../store/actions/account/loginParamsActions';

const mapStateToProps: (state: RootState) => RegisterProps = state => {
    var store = storeProvider();

    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: StoreDispatch) => RegisterActions = dispatch => {
    var store = storeProvider();

    return {
        onSubmit: (data) => store.dispatch(RegistrationActions.register(data,
            () => {
                store.dispatch(LoginParamsActions.setDefaultEmail(data.Email));
                store.dispatch(ClientContextActions.redirect(routeUrls.account.login()));
            }
        ))
    };
};

const RegisterContainer = connect(
     mapStateToProps,
     mapDispatchToProps
)(Register);

export default RegisterContainer;
