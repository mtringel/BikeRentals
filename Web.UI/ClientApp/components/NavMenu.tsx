import * as React from 'react';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import { RoleType } from '../models/security/roleType';
import { AppUser } from '../models/security/appUser';
import { Store } from '../store/store';
import { TypeHelper } from '../helpers/typeHelper';
import { ComponentBase } from '../helpers/componentBase';
import { ClientContextActions } from '../store/actions/shared/clientContextActions';

/// <summary>
/// Components do not extend RouteComponentProps
/// </summary>
export interface NavMenuProps {
    readonly store: Store;
    readonly history: any;
}

export interface NavMenuActions {
    readonly onAuthorize: (onSuccess: (authContext: NavMenuAuthContext) => void) => void;
    readonly onLogOff: (onSuccess: (() => void)) => void;
}

class NavMenuState {    
    readonly productTitle: string;
    readonly authContext: NavMenuAuthContext;
}

export class NavMenuAuthContext {
    public readonly currentUser: AppUser | null;
    public readonly allowBikes: boolean;
    public readonly allowUsers: boolean;
    public readonly allowMaps: boolean;
    public readonly allowMyRents: boolean;
    public readonly allowAllRents: boolean;
}

/// <summary>
/// Components DO NOT implement IScreen
/// </summary>
export class NavMenu extends ComponentBase<NavMenuProps & NavMenuActions, NavMenuState> {

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var store = this.props.store;
        var rootState = store.getState();

        store.dispatch(ClientContextActions.setNavMenu(this));

        var empty: NavMenuState = {
            productTitle: rootState.clientContext.globals.ProductTitle,
            authContext: new NavMenuAuthContext()
        };

        this.setState(empty, () => this.refresh());
    }

    public componentWillUnmount() {
        if (super.componentWillUnmount) super.componentWillUnmount();

        this.props.store.dispatch(ClientContextActions.setNavMenu(null));
    }

    public refresh() {
        this.props.onAuthorize(
            authContext => {
                this.setState({ authContext: authContext });
            });
    }

    private logOut() {
        this.props.onLogOff(() => this.refresh());
    }

    public render(): JSX.Element | null | false {
        return <div className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>{this.state.productTitle}</Link>
                </div>
                <div className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        <li>
                            <NavLink to='/' exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        {this.state.authContext.allowBikes &&
                            <li>
                                <NavLink to='/bikes' activeClassName='active'>
                                    <span className='glyphicon glyphicon-cog'></span> Bikes
                            </NavLink>
                            </li>
                        }
                        {this.state.authContext.allowMyRents &&
                            <li>
                                <NavLink to='/myrents' activeClassName='active'>
                                    <span className='glyphicon glyphicon-tag'></span> My rents
                            </NavLink>
                            </li>
                        }
                        {this.state.authContext.allowAllRents &&
                            <li>
                                <NavLink to='/rents' activeClassName='active'>
                                    <span className='glyphicon glyphicon-tags'></span> All rents
                            </NavLink>
                            </li>
                        }
                        {this.state.authContext.allowMaps &&
                            <li>
                                <NavLink to='/map' activeClassName='active'>
                                    <span className='glyphicon glyphicon-map-marker'></span> Map
                            </NavLink>
                            </li>
                        }
                        {this.state.authContext.allowUsers &&
                            <li>
                                <NavLink to={'/users'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-user'></span> Users
                            </NavLink>
                            </li>
                        }
                    </ul>
                    {this.loginPartial()}
                </div>
            </div>
        </div>;
    }

    private userLinkFormatted(user: AppUser): string {
        return "Hello " + user.FullName + "!" + (user.Role != RoleType.User ? " (" + user.RoleTitle + ")" : "");
    }

    private loginPartial(): JSX.Element {

        if (!TypeHelper.isNullOrEmpty(this.state.authContext.currentUser)) {
            return <ul className="nav navbar-nav navbar-right">
                <li><NavLink to={'/profile'}>{this.userLinkFormatted(this.state.authContext.currentUser)}</NavLink></li>
                <li><NavLink to={'/'} onClick={() => this.logOut()}>Log Out</NavLink></li>
            </ul>;
        } else {
            return <ul className="nav navbar-nav navbar-right">
                <li><NavLink to='/login'>Log In</NavLink></li>
                <li><NavLink to='/register'>Register</NavLink></li>
            </ul>;
        }
    }
}