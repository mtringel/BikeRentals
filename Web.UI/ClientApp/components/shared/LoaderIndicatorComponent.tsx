/// <summary>
/// Load indicator component for displaying spinning donut.
/// Global list of instantiated components is maintained within ClientContext.
/// </summary>

import * as React from 'react';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { Store } from '../../store/store';
import { ComponentBase } from '../../helpers/componentBase';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';

export interface LoaderIndicatorComponentProps {
    readonly store: Store;
}

class LoaderIndicatorComponentState {
    public readonly show: boolean;
    public readonly imageUrl: string;
}

/// <summary>
/// Component files should contain only one exported class 
/// </summary>
export class LoaderIndicatorComponent extends ComponentBase<LoaderIndicatorComponentProps, LoaderIndicatorComponentState> {

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var store = this.props.store;
        var state = store.getState();

        store.dispatch(ClientContextActions.addLoaderIndicator(this));

        this.setState({
            imageUrl: state.clientContext.globals.BasePath + "/Content/images/loader-indicator.gif",
            show: false
        });
    }

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillUnmount() {
        if (super.componentWillUnmount) super.componentWillUnmount();

        this.props.store.dispatch(ClientContextActions.removeLoaderIndicator(this));
    }

    public show(show?: boolean | undefined | null) {
        this.setState({ show: show !== false });
    }

    public hide() {
        this.show(false);
    }

    public render(): JSX.Element | null | false {
        return <div>
            {this.state.show && <div className="loader-div"><img src={this.state.imageUrl} className="ajax-loader" /></div>}
        </div>;
    }
}