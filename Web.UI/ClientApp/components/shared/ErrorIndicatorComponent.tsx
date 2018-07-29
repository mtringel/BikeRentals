/// <summary>
/// Error indicator component for displaying errors and validation errors on top of the screen.
/// Global list of instantiated components is maintained within ClientContext.
/// </summary>

import * as React from 'react';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { StringHelper } from '../../helpers/stringHelper';
import { Store } from '../../store/store';
import { ComponentBase } from '../../helpers/componentBase';
import { ClientContextActions, ClientContextActionsPayload } from '../../store/actions/shared/clientContextActions';

export interface ErrorIndicatorComponentProps {
    readonly store: Store;
}

class ErrorIndicatorComponentState {
    public readonly show: boolean;
    public readonly message: string;
}

/// <summary>
/// Component files should contain only one exported class.
/// This component has its internal state.
/// Understands:
/// - <b></b> for bold
/// - <i></i> for italic
/// - <ul><li></li></ul> for lists
/// - | for new line
/// the rest remains encoded.
/// </summary>
export class ErrorIndicatorComponent extends ComponentBase<ErrorIndicatorComponentProps, ErrorIndicatorComponentState> {

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.props.store.dispatch(ClientContextActions.addErrorIndicator(this));
        this.setState(new ErrorIndicatorComponentState());
    }

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillUnmount() {
        if (super.componentWillUnmount) super.componentWillUnmount();

        this.props.store.dispatch(ClientContextActions.removeErrorIndicator(this));
    }


    /// <summary>
    /// Injection safe, support only particular html elements, the rest remains encoded.
    /// Understands:
    /// - <b></b> for bold
    /// - <i></i> for italic
    /// - <ul><li></li></ul> for lists
    /// - | for new line
    /// the rest remains encoded.
    /// </summary>
    public show(message: string) {

        if (message != null) {

            // encode
            message = StringHelper.replaceAll(message, "<", "&lt;");
            message = StringHelper.replaceAll(message, ">", "&gt;");

            // |
            message = StringHelper.replaceAll(message, "|", "\r\n");

            // <br>, <br/>
            message = StringHelper.replaceAll(message, "&lt;br/&gt;", "<br/>");
            message = StringHelper.replaceAll(message, "&lt;br&gt;", "<br/>");

            // <b></b>
            message = StringHelper.replaceAll(message, "&lt;b&gt;", "<b>");
            message = StringHelper.replaceAll(message, "&lt;/b&gt;", "</b>");

            // <i></i>
            message = StringHelper.replaceAll(message, "&lt;i&gt;", "<i>");
            message = StringHelper.replaceAll(message, "&lt;/i&gt;", "</i>");

            // <ul></ul>
            message = StringHelper.replaceAll(message, "&lt;ul&gt;", "<ul>");
            message = StringHelper.replaceAll(message, "&lt;/ul&gt;", "</ul>");

            // <li></li>
            message = StringHelper.replaceAll(message, "&lt;li&gt;", "<li>");
            message = StringHelper.replaceAll(message, "&lt;/li&gt;", "</li>");
        }

        this.setState({
            show: message !== null,
            message: message
        });
    }

    public hide() {
        this.show(null);
    }

    public render(): JSX.Element | null | false {
        return <div>
            {this.state.show && <div className="alert alert-danger" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: this.state.message }}></div>}
        </div>
    }
}