import * as React from 'react';
import { connect } from 'react-redux';
import { FormEvent } from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import { User } from '../../models/users/user';
import { RoleType } from '../../models/security/roleType';
import { UserFormComponent } from '../../components/users/UserFormComponent';
import { UserAuthContext } from '../../models/users/userAuthContext';
import { UserDeleteModalComponent } from '../../components/users/UserDeleteModalComponent';
import Button from 'react-bootstrap/lib/Button';
import { KeyValuePair } from '../../models/shared/keyValuePair';
import { IScreen } from '../../helpers/IScreen';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { RouteComponentProps } from 'react-router';
import { FormValidatorActions } from '../../store/actions/shared/formValidatorActions';
import { UserFormData } from '../../models/users/userFormData';

export interface UserEditProps extends PropsBase {
    readonly store: Store;
}

export interface UserEditActions {
    readonly onInit: (userId: string, isNewUser: boolean, onSuccess: (options: { authContext: UserAuthContext, initialLoadCached: boolean }) => void) => void;
    readonly onLoad: (allowCachedData: boolean, userId: string, isNewUser: boolean, isProfile: boolean, onSuccess: (data: UserFormData) => void) => void; 
    readonly onCancel: (user: User, isNewUser: boolean, isProfile: boolean) => void;
    readonly onSave: (user: User, isNewUser: boolean, isProfile: boolean) => void;
    readonly onDelete: (user: User, isNewUser: boolean, isProfile: boolean) => void;
}

class UserEditState {
    readonly data: UserFormData; 
    readonly userId: string; // id == userId or "new" or "profile" (own)
    readonly isNewUser: boolean;
    readonly isDirty: boolean;
    readonly authContext: UserAuthContext;
    readonly isInitialized: boolean;
}

type ThisProps = UserEditProps & UserEditActions;
type ThisState = UserEditState;

export class UserEdit extends ScreenBase<ThisProps, ThisState> 
{
    private form: HTMLFormElement;
    private userDeleteModal: UserDeleteModalComponent;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        // set empty state for render()
        var userId = TypeHelper.notNullOrEmpty((this.props as any).match.params.userId, "profile");
        var isNew = StringHelper.equals(userId, "new", true);

        this.props.onInit(userId, isNew, options => {

            var empty: ThisState = {
                data: new UserFormData(),
                userId: userId,
                isNewUser: isNew,
                isDirty: false,
                authContext: options.authContext,
                isInitialized: false
            };

            // set empty state for render()
            // invoke asynchronous load after successful authorization        
            this.setState(empty, () => {
                if (options.authContext.canManage)
                    this.loadData(options.initialLoadCached)
            });
        });
    }

    private loadData(allowCachedData: boolean) {
        this.props.onLoad(
            allowCachedData,
            this.state.userId,
            this.state.userId === "new",
            this.state.userId === "profile",
            data => this.setState({ data: data, isInitialized: true })
        );
    }

    private cancel() {
        this.props.onCancel(this.state.data.User, this.state.isNewUser, this.state.userId === "profile");
    }

    private submit() {
        if (this.state.isInitialized) {
            this.props.store.dispatch(FormValidatorActions.validateForm(
                this.form,
                (isValid, errors) => {
                    if (isValid)
                        this.props.onSave(this.state.data.User, this.state.isNewUser, this.state.userId === "profile");
                    else
                        this.props.store.dispatch(FormValidatorActions.showValidationErrors());
                }
            ));
        }
    }

    private confirmDelete() {
        if (this.state.isInitialized && !this.state.isNewUser)
            this.userDeleteModal.show();
    }

    private delete() {
        if (this.state.isInitialized && !this.state.isNewUser)
            this.props.onDelete(this.state.data.User, this.state.isNewUser, this.state.userId === "profile");
    }

    private change(changed: Partial<User>) {
        this.setState({ data: { ...this.state.data, User: { ...this.state.data.User, ...changed } }, isDirty: true });
    }

    public render(): JSX.Element | null | false {
        return <div>
            <h2>{this.state.isNewUser ? "New user" : this.state.userId === "profile" ? "Edit profile" : "Modify user"}</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div id="panelPrimary" className="panel panel-primary">

                <div className="panel-heading">User Form</div>
                <div className="panel-body">

                    <form className="form-horizontal" role="form" id="form" name="form" ref={form => this.form = form} onSubmit={e => { e.preventDefault(); this.submit(); }}>

                        <UserFormComponent
                            user={this.state.data.User}
                            authContext={this.state.authContext}
                            requirePassword={this.state.isNewUser}
                            showPassword={true}
                            isReadOnly={!this.state.isInitialized}
                            onChange={(changed, data) => this.change(changed)}
                        />

                        {/* Buttons */}
                        <div className="form-group">
                            <div className="col-md-4 col-md-offset-3 col-sm-3 col-sm-offset-3 ">

                                {/* Cancel */}
                                <span>
                                    &nbsp;
                                    <Button bsStyle="warning" onClick={e => this.cancel()}>
                                        <i className="glyphicon glyphicon-thumbs-down"></i> Cancel
                                    </Button>
                                    &nbsp;
                                </span>

                                {/* Save */}
                                <span>
                                    &nbsp;
                                    <Button bsStyle="primary" type="submit" disabled={!this.state.isInitialized || !this.state.isDirty} >
                                        <i className="glyphicon glyphicon-thumbs-up"></i> Save
                                    </Button>
                                    &nbsp;
                                </span>

                                {/* Delete */}
                                {!this.state.isNewUser && <span>
                                    &nbsp;
                                    <Button bsStyle="danger" disabled={!this.state.isInitialized} onClick={e => this.confirmDelete()} >
                                        <i className="glyphicon glyphicon-trash"></i> Delete
                                    </Button>
                                    &nbsp;
                                    </span>
                                }

                            </div>
                        </div>
                    </form>

                </div>
            </div>

            <UserDeleteModalComponent
                ref={el => this.userDeleteModal = el}
                authContext={this.state.authContext}
                user={this.state.data.User}
                onCancel={(props, modal) => modal.hide()}
                onConfirm={(props, modal) => { modal.hide(); this.delete(); }}
            />
        </div>;
    }
}