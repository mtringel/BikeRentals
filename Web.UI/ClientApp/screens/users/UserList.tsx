import * as React from 'react';
import { FormEvent } from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import { UserListData } from '../../models/users/userListData';
import { User } from '../../models/users/user';
import { AppUser } from '../../models/security/appUser';
import { RoleType } from '../../models/security/roleType';
import { UserAuthContext } from '../../models/users/userAuthContext';
import Button from 'react-bootstrap/lib/Button';
import { IScreen } from '../../helpers/IScreen';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';

export interface UserListProps extends PropsBase {
    readonly store: Store;
}

export interface UserListActions {
    readonly onAuthorize: (onSuccess: (authContext: UserAuthContext) => void) => void;
    readonly onAllowCachedData: (invalidateCaches: boolean) => boolean;
    readonly onLoad: (allowCachedData: boolean, filter: string, onSuccess: (data: UserListData) => void) => void;
    readonly onEdit: (filter: string, user: User) => void;
    readonly onAddNew: (filter: string) => void;    
}

class UserListState {
    public readonly filter: string;
    public readonly data: UserListData;
    public readonly authContext: UserAuthContext;
    public readonly isInitialized: boolean;
}

export class UserList extends ScreenBase<UserListProps & UserListActions, UserListState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var allowCachedData = this.props.onAllowCachedData(true);
        var storeState = this.props.store.getState().users;

        // set empty state for render()
        var empty: UserListState = {
            filter: StringHelper.notNullOrEmpty(storeState.listFilter, ""),
            data: new UserListData(),
            authContext: new UserAuthContext(),
            isInitialized: false,
        };

        // invoke asynchronous load after successful authorization
        this.setState(empty,
            () => {
                this.props.onAuthorize(
                    authContext => {
                        this.setState({ authContext: authContext },
                            () => {
                                this.loadData(allowCachedData);
                            });
                    });
            });
    }

    private loadData(allowCachedData: boolean) {
        this.props.onLoad(allowCachedData, this.state.filter, t => this.setState({ data: t, isInitialized: true }));
    }

    private addNew() {
        if (this.state.isInitialized)
            this.props.onAddNew(this.state.filter);
    }

    private search() {
        this.loadData(false);
    }

    private edit(user: User) {
        if (this.state.isInitialized)
            this.props.onEdit(this.state.filter, user);
    }

    private canEdit(user: User): boolean {
        // only admin can edit admin (plus only admin can edit the role of a user manager)
        return this.state.authContext.canManage && (this.state.authContext.canEditAdmin || (user.Role !== RoleType.Manager && user.Role !== RoleType.Admin));
    }

    private canAddNew(): boolean {
        return this.state.authContext.canManage;
    }

    public render(): JSX.Element | null | false {
        return <div>
            <h2>Users</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div id="panelPrimary" className="panel panel-primary">

                <div className="panel-heading">User List</div>
                <div className="panel-body">

                    {/* Header row */}
                    <div className="row">
                        <div className="col-md-4">
                            {this.canAddNew() && <Button bsStyle="primary" disabled={!this.state.isInitialized} onClick={e => this.addNew()}>
                                <i className="glyphicon glyphicon-file"></i> New
                            </Button>}
                        </div>

                        <div className="col-md-4">
                            {this.state.data.TooMuchData && <b>Too many rows, please enter a search criteria!</b>}
                            &nbsp;
                        </div>

                        <div className="col-md-4">
                            <div className="input-group">
                                <input type="text" id="searchText" className="form-control pull-right" disabled={!this.state.isInitialized} value={StringHelper.notNullOrEmpty(this.state.filter, "")}
                                    placeholder="Search for..." onChange={e => this.setState({ filter: e.target.value })} />
                                <span className="input-group-btn">
                                    <Button type="submit" bsStyle="default" disabled={!this.state.isInitialized} onClick={e => this.search()}>
                                        <i className="text-muted glyphicon glyphicon-search"></i>
                                    </Button>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td>Last Name</td>
                                    <td>First Name</td>
                                    <td>Email</td>
                                    <td>Role</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.List.map(item =>
                                    <tr key={item.UserId} >
                                        <td>{item.LastName}</td>
                                        <td>{item.FirstName}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.RoleTitle}</td>
                                        <td>
                                            {this.canEdit(item) && <Button bsStyle="primary" bsSize="xsmall" onClick={e => this.edit(item)} >
                                                <i className="glyphicon glyphicon-edit"></i>
                                            </Button>
                                            }
                                        </td>
                                    </tr>
                                ,this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>;
    }
}