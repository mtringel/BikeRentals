import * as React from 'react';
import { connect } from 'react-redux';
import { FormEvent } from 'react';
import { User } from '../../models/users/user';
import { RoleType, RoleTypeHelper } from '../../models/security/roleType';
import { KeyValuePair } from '../../models/shared/keyValuePair';
import { RootState } from '../../store/state/rootState';
import { UserAuthContext } from '../../models/users/userAuthContext';
import { ComponentBase } from '../../helpers/componentBase';
import { MathHelper } from '../../helpers/mathHelper';
import { TypeHelper } from '../../helpers/typeHelper';

export interface UserFormComponentProps  {
    readonly user: User;
    readonly authContext: UserAuthContext;
    readonly requirePassword: boolean;
    readonly showPassword: boolean;
    readonly isReadOnly: boolean;
}

class UserFormComponentState {
    readonly user: User;
    readonly isDirty: boolean;
}

export interface UserFormComponentActions {
    readonly onChange: (changed: Partial<User>, user: User) => void;
}

/// <summary>
/// Components DO NOT implement IScreen
/// </summary>
export class UserFormComponent extends ComponentBase<UserFormComponentProps & UserFormComponentActions, UserFormComponentState> {

    public componentWillReceiveProps(nextProps: Readonly<UserFormComponentProps & UserFormComponentActions>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.initialize(this.props);
    }

    private initialize(props: Readonly<UserFormComponentProps & UserFormComponentActions>) {
        // set state for render()
        var initial = {
            user: props.user,
            isDirty: false
        };

        this.setState(initial);
    }

    private change(changed: Partial<User>) {
        this.setState(
            {
                user: { ...this.state.user, ...changed },
                isDirty: true
            },
            () => this.props.onChange(changed, this.state.user)
        );
    }

    public render(): JSX.Element | null | false {
        return <div>
            {/* First name */}
            <div className="form-group">
                <label htmlFor="firstName" className="col-sm-3 control-label">First Name</label>
                <div className="col-sm-6 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-info-sign"></i></span>
                    <input type="text" id="firstName" name="firstName" className="form-control" value={this.state.user.FirstName} required={true} maxLength={50} disabled={this.props.isReadOnly}
                        placeholder="Please fill mandatory field" onChange={e => this.change({ FirstName: e.target.value })} />
                </div>
            </div>

            {/* Last name */}
            <div className="form-group">
                <label htmlFor="lastName" className="col-sm-3 control-label">Last Name</label>
                <div className="col-sm-6 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-info-sign"></i></span>
                    <input type="text" id="lastName" name="lastName" className="form-control" value={this.state.user.LastName} required={true} maxLength={50} disabled={this.props.isReadOnly}
                        placeholder="Please fill mandatory field" onChange={e => this.change({ LastName: e.target.value })} />
                </div>
            </div>

            {/* Email */}
            <div className="form-group">
                <label htmlFor="email" className="col-sm-3 control-label">Email</label>
                <div className="col-sm-6 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                    <input type="email" id="email" name="email" className="form-control" value={this.state.user.Email} required={true} maxLength={50} disabled={this.props.isReadOnly}
                        placeholder="Please fill mandatory field" onChange={e => this.change({ Email: e.target.value })} />
                </div>
            </div>

            {/* Password */}
            {this.props.showPassword &&
                <div className="form-group" >
                    <label htmlFor="password" className="col-sm-3 control-label">Reset password</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                        <input type="password" id="password" name="password" className="form-control" value={this.state.user.Password} maxLength={50} disabled={this.props.isReadOnly}
                            required={this.props.requirePassword}
                            placeholder={this.props.requirePassword ? "Please fill mandatory field" : "Please fill to reset password"}
                            onChange={e => this.change({ Password: e.target.value })}
                        />
                    </div>
                </div>
            }

            {/* Password confirmation */}
            {this.props.showPassword &&
                <div className="form-group" >
                    <label htmlFor="confirmPassword" className="col-sm-3 control-label">Confirm password</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                        <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" value={this.state.user.ConfirmPassword} maxLength={50} disabled={this.props.isReadOnly}
                            required={this.props.requirePassword}
                            placeholder={this.props.requirePassword ? "Please fill mandatory field" : "Please fill to reset password"}
                            onChange={e => this.change({ ConfirmPassword: e.target.value })}
                        />
                    </div>
                </div>
            }

            {/* Role */}
            <div className="form-group" >
                <label htmlFor="role" className="col-sm-3 control-label">Role</label>
                <div className="col-sm-6 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-tower"></i></span>
                    <select id="role" name="role" className="form-control" value={this.state.user.Role} required={true}
                        disabled={!this.props.authContext.canSetRole || this.props.isReadOnly}
                        placeholder="Please fill mandatory field"
                        onChange={e => {
                            var index = MathHelper.clamp(parseInt(e.target.value), 0, e.target.options.length - 1);
                            this.change({
                                Role: index as RoleType,
                                RoleTitle: e.target.options[index].text
                            });
                        }}
                    >
                        {this.props.isReadOnly && <option value={this.state.user.Role}>{this.state.user.RoleTitle}</option>}
                        {!this.props.isReadOnly && RoleTypeHelper.allRoles.filter(t => t != RoleType.Disabled).map(item => RoleTypeHelper.getOption(item))}
                    </select>
                </div>
            </div>
        </div>;
    }
}