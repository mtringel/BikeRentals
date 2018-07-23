import * as React from 'react'; 
import { Link } from 'react-router-dom';
import { FormEvent } from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { LoginData } from '../../models/account/loginData';
import { StringHelper } from '../../helpers/stringHelper';
import Button from 'react-bootstrap/lib/Button';
import { Store } from '../../store/store';
import { IScreen } from '../../helpers/IScreen';
import { ScreenBase } from '../../helpers/screenBase';
import { FormValidatorActions } from '../../store/actions/shared/formValidatorActions';

export interface LoginProps {
    readonly store: Store;

    // query params
    readonly returnUrl: string | undefined | null;
    readonly email: string; // Register redirects to login with email

}

export interface LoginActions {
    readonly onSubmit: (data: LoginData, returnUrl?: string | undefined | null) => void;
}

class LoginState {
    public readonly data: LoginData;
}

type ThisProps = LoginProps & LoginActions;
type ThisState = LoginState;

export class Login extends ScreenBase<ThisProps, ThisState> {
    private form: HTMLFormElement;
    private email: HTMLInputElement;
    private password: HTMLInputElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var empty: ThisState = {
            data: new LoginData()
        };

        this.setState(empty);
    }

    public componentDidMount() {
        if (super.componentDidMount) super.componentDidMount();

        if (StringHelper.isNullOrEmpty(this.props.email)) {
            this.email.focus();
        }
        else {
            this.setState({ data: { ...this.state.data, Email: this.props.email } });
            this.password.focus();
        }
    }

    private submit() {
        this.props.store.dispatch(FormValidatorActions.validateForm(
            this.form,
            (isValid, errors) => {
                if (isValid)
                    this.props.onSubmit(this.state.data, this.props.returnUrl);
                else
                    this.props.store.dispatch(FormValidatorActions.showValidationErrors());
            }
        ));
    }

    public render(): JSX.Element | null | false {
        return <div>
            <h2>Log in</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div className="panel panel-primary">

                <div className="panel-heading">Login Form</div>
                <div className="panel-body">

                    <form className="form-horizontal" role="form" id="form" name="form" ref={form => this.form = form} onSubmit={e => { e.preventDefault(); this.submit(); }}>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="col-sm-3 control-label">Email</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                                <input type="email" id="email" name="email" ref={el => this.email = el} className="form-control" value={this.state.data.Email} required={true} maxLength={50}
                                    placeholder="Please enter email address" onChange={e => this.setState({ data: { ...this.state.data, Email: e.target.value } })} />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password" className="col-sm-3 control-label">Password</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                                <input type="password" id="password" name="password" ref={el => this.password = el} className="form-control" value={this.state.data.Password} required={true} maxLength={50}
                                    placeholder="Please enter password" onChange={e => this.setState({ data: { ...this.state.data, Password: e.target.value } })} />
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="form-group">
                            <label htmlFor="rememberMe" className="col-sm-3 control-label">Remember me?</label>
                            <div className="col-sm-6 checkbox">
                                <label className="checkbox-bootstrap checkbox-lg">
                                    <input type="checkbox" id="rememberMe" name="rememberMe" checked={this.state.data.RememberMe}
                                        placeholder="Remember me?" onChange={e => this.setState({ data: { ...this.state.data, RememberMe: e.target.checked } })} />
                                    {/* do not remove this span */}
                                    <span className="checkbox-placeholder" />
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="col-sm-3" />
                            <div className="col-sm-6">
                                <Link to="/register">Register as a new user</Link>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-md-4 col-md-offset-3 col-sm-3 col-sm-offset-3 ">
                                <Button type="submit" bsStyle="primary">
                                    <i className="glyphicon glyphicon-thumbs-up"></i> Log in
                                </Button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>;
    }
}