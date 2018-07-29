/// <summary>
/// Numberic range component for numberic range selection (with or without precision).
/// Wraps react-numeric-input.
/// https://www.npmjs.com/package/react-numeric-input
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { Store } from '../../store/store';
import { TypeHelper } from '../../helpers/typeHelper';
import NumericInput from 'react-numeric-input';
import { StringHelper } from '../../helpers/stringHelper';

export interface NumericRangeComponentProps {
    readonly start: number | null;
    readonly end: number | null;
    readonly min: number | null;
    readonly max: number | null;
    readonly isReadOnly: boolean;
    readonly defaultEnd: number | null;
    readonly defaultStart: number | null;
    readonly step: number | null; // default: 1
    readonly precision: number | null; // default: 0
    readonly glyphIcon: string | null;
    readonly suffix: string | null;
    readonly inputSuffix: string | null;
}

export interface NumericRangeComponentActions {
    readonly onChange: (start: number, end: number) => void;
}

class NumericRangeComponentState {
    readonly start: number | null;
    readonly end: number | null;
}

type ThisProps = NumericRangeComponentProps & NumericRangeComponentActions;
type ThisState = NumericRangeComponentState;

export class NumericRangeComponent extends ComponentBase<ThisProps, ThisState> {

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
    /// </summary>
    public initialize(props: ThisProps) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: ThisState = {
            start: props.start,
            end: props.end
        };

        this.setState(initial);
    }

    private onSelectionChanged(start: number | null, end: number | null) {
        if (!this.props.isReadOnly) {
            var from = TypeHelper.notNullOrEmpty(start, this.props.defaultStart);
            var to = TypeHelper.notNullOrEmpty(end, this.props.defaultEnd);

            // check min/max
            if (!TypeHelper.isNullOrEmpty(from)) {
                if (!TypeHelper.isNullOrEmpty(this.props.min) && from < this.props.min)
                    from = this.props.min;

                if (!TypeHelper.isNullOrEmpty(this.props.max) && from > this.props.max)
                    from = this.props.max;
            }

            if (!TypeHelper.isNullOrEmpty(to)) {
                if (!TypeHelper.isNullOrEmpty(this.props.min) && to < this.props.min)
                    to = this.props.min;

                if (!TypeHelper.isNullOrEmpty(this.props.max) && to > this.props.max)
                    to = this.props.max;
            }

            this.setState({ start: from, end: to }, () => this.props.onChange(from, to));
        }
    }

    public render(): JSX.Element | null | false {
        return <div className="text-nowrap form-horizontal">
            {/* From */}
            <span className="col-sm-6 form-group">
                <span className="col-sm-12 input-group">
                    {!StringHelper.isNullOrEmpty(this.props.glyphIcon) &&
                        < span className="input-group-addon" > <i className={"glyphicon glyphicon-" + this.props.glyphIcon}></i></span>
                    }
                    <NumericInput
                        className="form-control text-right"
                        value={this.state.start}
                        disable={this.props.isReadOnly}
                        step={TypeHelper.notNullOrEmpty(this.props.step, 1)}
                        precision={TypeHelper.notNullOrEmpty(this.props.precision, 0)}
                        onChange={t => this.onSelectionChanged(t, this.state.end)}
                        format={t => t + StringHelper.notNullOrEmpty(this.props.inputSuffix, "")}
                        parse={t => StringHelper.removeSuffix(t, this.props.inputSuffix, true)}
                    />
                </span>
            </span>
            <span className="col-sm-1">
                <label className="control-label text-nowrap">-</label>
            </span>
            {/* To */}
            <span className="col-sm-5 form-group">
                <span className="col-sm-12 input-group">
                    <NumericInput
                        className="form-control text-right"
                        value={this.state.end}
                        disable={this.props.isReadOnly}
                        step={TypeHelper.notNullOrEmpty(this.props.step, 1)}
                        precision={TypeHelper.notNullOrEmpty(this.props.precision, 0)}
                        onChange={t => this.onSelectionChanged(this.state.start, t)}
                        format={t => t + StringHelper.notNullOrEmpty(this.props.inputSuffix, "")}
                        parse={t => StringHelper.removeSuffix(t, this.props.inputSuffix, true)}
                    />
                </span>
            </span>
            {!StringHelper.isNullOrEmpty(this.props.suffix) &&
                < span className="col-sm-1" ><label className="control-label text-nowrap">{this.props.suffix}</label></span>
            }
        </div>;
    }
}