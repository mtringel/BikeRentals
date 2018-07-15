import * as React from 'react';
import { FormEvent } from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { RegisterData } from '../../models/account/registerData';
import Button from 'react-bootstrap/lib/Button';
import { IScreen } from '../../helpers/IScreen';
import { Store } from '../../store/store';
import { ScreenBase } from '../../helpers/screenBase';
import { FormValidatorActions } from '../../store/actions/shared/formValidatorActions';

export interface RegisterProps {
    readonly store: Store;
}

export interface RegisterActions {
    readonly onSubmit: (data: RegisterData) => void;
}

class RegisterState {
    public readonly data: RegisterData;
}

export class Register extends ScreenBase<RegisterProps & RegisterActions, RegisterState> 
{
    private form: HTMLFormElement;
    private firstName: HTMLInputElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var empty: RegisterState = {
            data: new RegisterData()
        };
        this.setState(empty);
    }

    private submit() {
        this.props.store.dispatch(FormValidatorActions.validateForm(
            this.form,
            (isValid, errors) => {
                if (isValid)
                    this.props.onSubmit(this.state.data);
                else
                    this.props.store.dispatch(FormValidatorActions.showValidationErrors());
            }
        ));
    }

    public render(): JSX.Element | null | false {

        return <div><h2>Register new user</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div className="panel panel-primary">

                <div className="panel-heading">Registration Form</div>
                <div className="panel-body">

                    <form className="form-horizontal" role="form" id="form" name="form" ref={form => this.form = form} onSubmit={e => { e.preventDefault(); this.submit(); } }>

                        {/* FirstName */}
                        <div className="form-group">
                            <label htmlFor="firstName" className="col-sm-3 control-label">First name</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-info-sign"></i></span>
                                <input type="text" id="firstName" name="firstName" ref={el => this.firstName = el} className="form-control" value={this.state.data.FirstName} required={true} maxLength={50}
                                    placeholder="Please enter first name" onChange={e => this.setState({ data: { ...this.state.data, FirstName: e.target.value } })} />
                            </div>
                        </div>

                        {/* LastName */}
                        <div className="form-group">
                            <label htmlFor="lastName" className="col-sm-3 control-label">Last name</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-info-sign"></i></span>
                                <input type="text" id="lastName" name="lastName" className="form-control" value={this.state.data.LastName} required={true} maxLength={50}
                                    placeholder="Please enter last name" onChange={e => this.setState({ data: { ...this.state.data, LastName: e.target.value } })} />
                            </div>
                        </div>


                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="col-sm-3 control-label">Email</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                                <input type="email" id="email" name="email" className="form-control" value={this.state.data.Email} required={true} maxLength={50}
                                    placeholder="Please enter email address" onChange={e => this.setState({ data: { ...this.state.data, Email: e.target.value } })} />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password" className="col-sm-3 control-label">Password</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                                <input type="password" id="password" name="password" className="form-control" value={this.state.data.Password} required={true} maxLength={50}
                                    placeholder="Please enter password" onChange={e => this.setState({ data: { ...this.state.data, Password: e.target.value } })} />
                            </div>
                        </div>

                        {/* ConfirmPassword */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="col-sm-3 control-label">Confirm password</label>
                            <div className="col-sm-6 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
                                <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" value={this.state.data.ConfirmPassword} required={true} maxLength={50}
                                    placeholder="Please confirm password" onChange={e => this.setState({ data: { ...this.state.data, ConfirmPassword: e.target.value } })} />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-group">
                            <div className="col-md-4 col-md-offset-3 col-sm-3 col-sm-offset-3 ">
                                <Button type="submit" bsStyle="primary" >
                                    <i className="glyphicon glyphicon-thumbs-up"></i> Register
                                </Button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>;
    }

}