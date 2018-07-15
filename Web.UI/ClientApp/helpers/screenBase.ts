import * as React from 'react';
import { IScreen } from './IScreen';
import { Store } from '../store/store';
import { ClientContextActions } from '../store/actions/shared/clientContextActions';

export interface PropsBase {
    readonly store: Store;
}

/// <summary>
/// Base class for screens
/// </summary>
export class ScreenBase<Props extends PropsBase, State> extends React.PureComponent<Props, State> implements IScreen {

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.props.store.dispatch(ClientContextActions.setActiveScreen(this));
    }

    public currentPath(): string { return (this.props as any).location.pathname; }

    public redirect(url: string) { (this.props as any).history.push(url); }
}