import * as React from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import { UserListData } from '../../models/users/userListData';
import { User } from '../../models/users/user';
import { AppUser } from '../../models/security/appUser';
import { RoleType } from '../../models/security/roleType';
import { UserAuthContext } from '../../models/users/userAuthContext';
import Button from 'react-bootstrap/lib/Button';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';

export interface UserListProps extends PropsBase {
    readonly store: Store;
}

export interface UserListActions {    
    readonly onInit: (onSuccess: (options: { authContext: UserAuthContext, initialLoadCached: boolean, keepNavigation: boolean }) => void) => void;
    readonly onLoad: (allowCachedData: boolean, filter: string, onSuccess: (data: UserListData) => void) => void;
    readonly onEdit: (user: User) => void;
    readonly onAddNew: () => void;    
}

class UserListState {
    readonly filter: string;
    readonly data = new UserListData();
    readonly authContext = new UserAuthContext();
    readonly isInitialized: boolean;
}

export class UserList extends ScreenBase<UserListProps & UserListActions, UserListState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        // set empty state so the form renderes for the user promptly without data
        this.setState(new UserListState(), () => {
            this.props.onInit(options => {
                var storeState = this.props.store.getState().users;

                this.setState({
                    filter: options.keepNavigation ? StringHelper.notNullOrEmpty(storeState.listFilter, "") : "",
                    data: new UserListData(),
                    authContext: options.authContext,
                    isInitialized: false,
                },
                    // invoke asynchronous load after successful authorization
                    () => this.loadData(options.initialLoadCached)
                );
            });
        });
    }

    private loadData(allowCachedData: boolean) {
        this.props.onLoad(allowCachedData, this.state.filter, t => this.setState({ data: t, isInitialized: true }));
    }

    private onAddNew() {
        if (this.state.isInitialized)
            this.props.onAddNew();
    }

    private onSearch() {
        this.loadData(false);
    }

    private onEdit(user: User) {
        if (this.state.isInitialized)
            this.props.onEdit(user);
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
                        {/* New button */}
                        <div className="col-md-4 text-left">
                            {this.canAddNew() && <Button bsStyle="primary" disabled={!this.state.isInitialized} onClick={e => this.onAddNew()}>
                                <i className="glyphicon glyphicon-file"></i> New
                            </Button>}
                        </div>

                        {/* Message */}
                        <div className="col-md-4 text-center">
                            {this.state.data.TooMuchData && <b>Too many rows, please enter a search criteria!</b>}
                            &nbsp;
                        </div>

                        {/* Free text filter */}
                        <div className="col-md-4 text-right">
                            <div className="input-group">
                                <input type="text" id="searchText" className="form-control pull-right" disabled={!this.state.isInitialized} value={StringHelper.notNullOrEmpty(this.state.filter, "")}
                                    placeholder="Search for..." onChange={e => this.setState({ filter: e.target.value })} />
                                <span className="input-group-btn">
                                    <Button type="submit" bsStyle="default" disabled={!this.state.isInitialized} onClick={e => this.onSearch()}>
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
                                            {this.canEdit(item) && <Button bsStyle="primary" bsSize="xsmall" onClick={e => this.onEdit(item)} >
                                                <i className="glyphicon glyphicon-edit"></i>
                                            </Button>
                                            }
                                        </td>
                                    </tr>
                                    , this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>;
    }
}