import * as React from 'react';
import * as RoutesModule from '../routes';
import { connect } from 'react-redux';
import { RootState } from '../store/state/rootState';
import { Home, HomeProps, HomeActions } from '../screens/Home';
import { storeProvider } from '../boot';
import { IStoreAction } from '../store/actions/storeAction';
import { Router } from 'react-router';
import { AuthServiceActions } from '../store/actions/security/authServiceActions';

const mapStateToProps: (state: RootState) => HomeProps = state => {
    var store = storeProvider();
    
    return {
        store: store
    };
};

const mapDispatchToProps: (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void) => HomeActions = dispatch => {
    var store = storeProvider();
    
    return {
        onAutoLogin: () => store.dispatch(AuthServiceActions.autoLogin())
    };
};

const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

export default HomeContainer;
