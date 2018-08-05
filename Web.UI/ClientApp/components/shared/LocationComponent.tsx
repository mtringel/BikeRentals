/// <summary>
/// Location component for entering locations.
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { MathHelper } from '../../helpers/mathHelper';
import { Location } from '../../models/master/location';
import NumericInput from 'react-numeric-input';
import { StringHelper } from '../../helpers/stringHelper';

export interface LocationComponentOption {
    value: string;
    text: string;
}

export interface LocationComponentProps {
    readonly isReadOnly: boolean;
    readonly value: Location | null | undefined;
}

export interface LocationComponentActions{
    readonly onChange: (value: Location) => void;
}

class LocationComponentState {
    readonly value: Location;
}

type ThisProps = LocationComponentProps & LocationComponentActions;
type ThisState = LocationComponentState;

export class LocationComponent<TItem> extends ComponentBase<ThisProps, ThisState> {

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.initialize(this.props);
    }

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public componentWillReceiveProps(nextProps: Readonly<ThisProps>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    /// <summary>
    /// Mandatory and must call super.
    /// DO NOT use this.props here, always user props parameter!
    /// </summary>+
    private initialize(props: ThisProps) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: ThisState = {
            value: props.value
        };

        this.setState(initial);
    }

    private onChange(value: Location) {
        if (!this.props.isReadOnly)
            this.setState({ value: value }, () => this.props.onChange(value));
    }

    public render(): JSX.Element | null | false {
        return <div className="text-nowrap form-inline" >
            {/* Lat */}
            <span className="col-sm-3 form-group">
                <span className="col-sm-12 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-option-vertical"></i></span>
                    <NumericInput
                        className="form-control text-right"
                        value={TypeHelper.isNullOrEmpty(this.state.value) ? null : this.state.value.Lat}
                        readOnly={this.props.isReadOnly}
                        precision={6}
                        onChange={t => this.onChange({ Lat: t, Lng: TypeHelper.isNullOrEmpty(this.state.value) ? 0 : this.state.value.Lng })}
                    />
                </span>
            </span>
            <span className="col-sm-1 text-left">
                <label className="col-sm-1 control-label">lat</label>
            </span>
            {/* Lng */}
            <span className="col-sm-3 form-group">
                <span className="col-sm-12 input-group">
                    <span className="input-group-addon"><i className="glyphicon glyphicon-option-horizontal"></i></span>
                    <NumericInput
                        className="form-control text-right"
                        value={TypeHelper.isNullOrEmpty(this.state.value) ? null : this.state.value.Lng}
                        readOnly={this.props.isReadOnly}
                        precision={6}
                        onChange={t => this.onChange({ Lat: TypeHelper.isNullOrEmpty(this.state.value) ? 0 : this.state.value.Lat, Lng: t })}
                    /></span>
            </span>
            <span className="col-sm-1 text-left">
                <label className="col-sm-1 control-label">lng</label>
            </span>
        </div>;
    }
}