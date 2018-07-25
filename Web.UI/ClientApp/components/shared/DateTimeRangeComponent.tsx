import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { Store } from '../../store/store';
import { DateHelper } from '../../helpers/dateHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { StringHelper } from '../../helpers/stringHelper';
import * as moment from 'moment';

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
export interface DateTimeRangeComponentProps {
    readonly store: Store;
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly minDate: Date | null;
    readonly maxDate: Date | null;
    readonly isReadOnly: boolean;
    readonly defaultEndDate: Date | null;
    readonly defaultStartDate: Date | null;
    readonly glyphIcon: string | null;
    readonly suffix: string | null;
    readonly format: string | null;
}

export interface DateTimeRangeComponentActions {
    readonly onChange: (startDate: Date, endDate: Date) => void;
}

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
class DateTimeRangeComponentState {
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly format: string;
}

type ThisProps = DateTimeRangeComponentProps & DateTimeRangeComponentActions;
type ThisState = DateTimeRangeComponentState;

export class DateTimeRangeComponent extends ComponentBase<ThisProps, ThisState> {

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

        var rootState = props.store.getState();

        var initial: ThisState = {
            startDate: props.startDate,
            endDate: props.endDate,
            format: StringHelper.notNullOrEmpty(this.props.format, "")
        };

        this.setState(initial);
    }

    private onSelectionChange(startDate: Date | null, endDate: (start: Date | null) => Date | null) {
        if (!this.props.isReadOnly) {
            var from = TypeHelper.notNullOrEmpty(startDate, this.props.defaultStartDate);

            // check min/max
            if (!TypeHelper.isNullOrEmpty(from)) {
                if (!TypeHelper.isNullOrEmpty(this.props.minDate) && from < this.props.minDate)
                    from = this.props.minDate;

                if (!TypeHelper.isNullOrEmpty(this.props.maxDate) && from > this.props.maxDate)
                    from = this.props.maxDate;
            }

            var to = TypeHelper.notNullOrEmpty(endDate(from), this.props.defaultEndDate);

            if (!TypeHelper.isNullOrEmpty(to)) {
                if (!TypeHelper.isNullOrEmpty(this.props.minDate) && to < this.props.minDate)
                    to = this.props.minDate;

                if (!TypeHelper.isNullOrEmpty(this.props.maxDate) && to > this.props.maxDate)
                    to = this.props.maxDate;
            }

            this.setState({ startDate: from, endDate: to }, () => this.props.onChange(from, to));
        }
    }

    private onStartChange(start: Date | null) {
        this.onSelectionChange(
            start,
            start => TypeHelper.isNullOrEmpty(start) || TypeHelper.isNullOrEmpty(this.state.endDate) ?
                null :
                DateHelper.addDays(this.state.endDate, DateHelper.dateDiffInDays(this.state.startDate, start))
        );
    }

    private onEndChange(end: Date | null) {
        this.onSelectionChange(DateHelper.min(end, this.state.startDate), start => end);
    }

    public render(): JSX.Element | null | false {
        return <div className="text-nowrap form-horizontal">
            {/* From */}
            <span className="col-sm-6 form-group">
                <span className="col-sm-12 input-group">
                    {!StringHelper.isNullOrEmpty(this.props.glyphIcon) &&
                        < span className="input-group-addon" > <i className={"glyphicon glyphicon-" + this.props.glyphIcon}></i></span>
                    }
                    {/* hack */}
                    {TypeHelper.isNullOrEmpty(this.state.startDate) &&
                        <DateTimeField
                            defaultText={""}
                            minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                            maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                            inputProps={{ className: "form-control", disable: this.props.isReadOnly }}
                            inputFormat={this.state.format}
                            onChange={t => this.onStartChange(DateHelper.parseDateMilliseconds(t))}
                        />
                    }
                    {!TypeHelper.isNullOrEmpty(this.state.startDate) &&
                        <DateTimeField
                            dateTime={moment(this.state.startDate)}
                            minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                            maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                            inputProps={{ className: "form-control", disable: this.props.isReadOnly }}
                            inputFormat={this.state.format}
                            onChange={t => this.onStartChange(DateHelper.parseDateMilliseconds(t))}
                        />
                    }
                </span>
            </span>
            <span className="col-sm-1">
                <label className="control-label text-nowrap">&nbsp;-&nbsp;</label>
            </span>
            {/* To */}
            <span className="col-sm-5 form-group">
                <span className="col-sm-12 input-group">
                    {/* hack */}
                    {TypeHelper.isNullOrEmpty(this.state.endDate) &&
                        <DateTimeField
                            defaultText={""}
                            minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                            maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                            inputProps={{ className: "form-control", disable: this.props.isReadOnly }}
                            inputFormat={this.state.format}
                            onChange={t => this.onEndChange(DateHelper.parseDateMilliseconds(t))}
                        />
                    }
                    {!TypeHelper.isNullOrEmpty(this.state.endDate) &&
                        <DateTimeField
                            dateTime={moment(this.state.endDate)}
                            minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                            maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                            inputProps={{ className: "form-control", disable: this.props.isReadOnly }}
                            inputFormat={this.state.format}
                            onChange={t => this.onEndChange(DateHelper.parseDateMilliseconds(t))}
                        />
                    }
                </span>
            </span>
            {!StringHelper.isNullOrEmpty(this.props.suffix) &&
                <span className="col-sm-1" ><label className="control-label text-nowrap">{this.props.suffix}</label></span>
            }
        </div>;
    }
}