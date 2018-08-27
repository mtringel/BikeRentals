import * as React from 'react';
import { User } from '../../models/users/user';
import { UserFormComponent } from '../../components/users/UserFormComponent';
import { UserAuthContext } from '../../models/users/userAuthContext';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { RouteComponentProps } from 'react-router';
import { ComponentBase } from '../../helpers/componentBase';

export interface UserDeleteModalComponentProps {
    readonly user: User;
    readonly authContext: UserAuthContext;
    readonly isInitialized: boolean;
}

export interface UserDeleteModalComponentActions {
    readonly onConfirm: (props: UserDeleteModalComponentProps, modal: UserDeleteModalComponent) => void;
    readonly onCancel: (props: UserDeleteModalComponentProps, modal: UserDeleteModalComponent) => void;
}

class UserDeleteModalComponentState {
    readonly show: boolean;
}

/// <summary>
/// Components DO NOT implement IScreen
/// </summary>
export class UserDeleteModalComponent extends ComponentBase<UserDeleteModalComponentProps & UserDeleteModalComponentActions, UserDeleteModalComponentState>
{
    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var empty: UserDeleteModalComponentState = {
            show: false
        };

        this.setState(empty);
    }

    public show(show?: boolean | undefined | null) {
        this.setState({ show: show !== false });
    }

    public hide() {
        this.show(false);
    }

    private cancel() {
        this.props.onCancel(this.props, this);
    }

    private submit() {
        this.props.onConfirm(this.props, this);
    }

    public render(): JSX.Element | null | false {
        return <Modal show={this.state.show} onHide={this.cancel}>
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Delete user?</Modal.Title>
                    <Modal.Body>
                        <form className="form-horizontal" role="form" id="form" name="form" onSubmit={e => { e.preventDefault(); this.submit(); }} >

                            <UserFormComponent
                                user={this.props.user}
                                authContext={this.props.authContext}
                                requirePassword={false}
                                isInitialized={this.props.isInitialized}
                                showPassword={false}
                                isReadOnly={true}
                                onChange={(changed, data) => { }}
                            />

                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <div className="row">
                            <div className="col-md-6 pull-left">
                            </div>

                            <div className="col-md-6 pull-right">
                                <Button bsStyle="warning" onClick={e => this.cancel()}><i className="glyphicon glyphicon-thumbs-down"></i> Cancel</Button>
                                <Button bsStyle="danger" onClick={e => this.submit()}><i className="glyphicon glyphicon-trash"></i> Delete</Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal.Header>
            </Modal.Dialog>
        </Modal>;
    }
}