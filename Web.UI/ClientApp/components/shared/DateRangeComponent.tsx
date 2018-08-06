/// <summary>
/// Date range component for date range selection (without time part).
/// Wraps react-bootstrap-date-picker.
/// https://www.npmjs.com/package/react-bootstrap-date-picker
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { Store } from '../../store/store';
import { DateHelper } from '../../helpers/dateHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { StringHelper } from '../../helpers/stringHelper';
import { DateComponent } from './DateComponent';

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
export interface DateRangeComponentProps {
    readonly store: Store;
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly minDate: Date | null;
    readonly maxDate: Date | null;
    readonly isReadOnly: boolean;
    readonly required: boolean;
    readonly defaultEndDate: Date | null;
    readonly defaultStartDate: Date | null;
    readonly glyphIcon: string;
    readonly format: string;
}

export interface DateRangeComponentActions {
    readonly onChange: (startDate: Date, endDate: Date) => void;
}

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
class DateRangeComponentState {
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly format: string;
}

type ThisProps = DateRangeComponentProps & DateRangeComponentActions;
type ThisState = DateRangeComponentState;

export class DateRangeComponent extends ComponentBase<ThisProps, ThisState> {

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
    private initialize(props: ThisProps) {
        if (super.componentWillMount) super.componentWillMount();

        var rootState = props.store.getState();

        var initial: ThisState = {
            startDate: props.startDate,
            endDate: props.endDate,
            format: StringHelper.notNullOrEmpty(props.format, "")
        };

        this.setState(initial);
    }

    private change(startDate: Date | null, endDate: (start: Date | null) => Date | null) {
        if (!this.props.isReadOnly) {
            var from = TypeHelper.notNullOrEmpty(startDate, this.props.defaultStartDate);
            var to = TypeHelper.notNullOrEmpty(endDate(from), this.props.defaultEndDate);

            this.setState({ startDate: from, endDate: to }, () => this.props.onChange(from, to));
        }
    }

    private onStartChange(start: Date | null) {
        this.change(
            start,
            // endDate?
            start => TypeHelper.isNullOrEmpty(start) || TypeHelper.isNullOrEmpty(this.state.endDate) ?
                null :
                DateHelper.addDays(this.state.endDate, DateHelper.dateDiffInDays(this.state.startDate, start))
        );
    }

    private onEndChange(end: Date | null) {
        this.change(
            DateHelper.min(end, this.state.startDate),
            start => end
        );
    }

    public render(): JSX.Element | null | false {
        {/* DatePicker.defaultValue, minDate and maxDate don't work */ }
        return <div className="text-nowrap form-inline">
            {/* From */}
            <span className="col-sm-6 form-group">
                <span className="col-sm-12 input-group">
                    {!StringHelper.isNullOrEmpty(this.props.glyphIcon) &&
                        < span className="input-group-addon" > <i className={"glyphicon glyphicon-" + this.props.glyphIcon}></i></span>
                    }
                    <DateComponent
                        className="form-control"
                        value={this.state.startDate}
                        isReadOnly={this.props.isReadOnly}
                        required={this.props.required}
                        defaultValue={this.props.defaultStartDate}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        format={this.props.format}
                        onChange={t => this.onStartChange(t)}
                    />
                </span>
            </span>
            <span className="col-sm-1">
                <label className="control-label text-nowrap">&nbsp;-&nbsp;</label>
            </span>
            {/* To */}
            <span className="col-sm-5 form-group">
                <span className="col-sm-12 input-group">
                    <DateComponent
                        className="form-control"
                        value={this.state.endDate}
                        isReadOnly={this.props.isReadOnly}
                        required={this.props.required}
                        defaultValue={this.props.defaultEndDate}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        format={this.props.format}
                        onChange={t => this.onEndChange(t)}
                    />
                </span>
            </span>
        </div>;
    }
}