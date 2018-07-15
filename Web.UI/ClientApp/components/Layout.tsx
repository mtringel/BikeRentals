import * as React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { storeProvider } from '../boot';
import { Store } from '../store/store';
import NavMenuContainer from '../containers/components/NavMenuContainer';

export interface LayoutProps {
    children?: React.ReactNode;
}

/// <summary>
/// Must be Component, cannot be PureComponent! (navigation will fail)
/// Components DO NOT implement IScreen
/// </summary>
export class Layout extends React.Component<LayoutProps, any> {

    public render() {
        return <Provider store={storeProvider().getInstance()} >
            <div className='container-fluid'>
                <NavMenuContainer />
                <div className='container body-content'>
                    {this.props.children}
                </div>
            </div>
        </Provider>;
    }
}