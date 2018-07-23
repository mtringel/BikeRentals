import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import DatePicker from 'react-bootstrap-date-picker';
import { Store } from '../../store/store';
import { DateHelper } from '../../helpers/dateHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { StringHelper } from '../../helpers/stringHelper';

export interface DateRangeComponentProps {
    readonly store: Store;
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly minDate: Date | null;
    readonly maxDate: Date | null;
    readonly isReadOnly: boolean;
    readonly defaultEndDate: Date | null;
    readonly defaultStartDate: Date | null;
    readonly glyphIcon: string | null;
    readonly suffix: string | null
}

export interface DateRangeComponentActions {
    readonly onChange: (startDate: Date, endDate: Date) => void;
}

class DateRangeComponentState {
    readonly startDate: Date | null;
    readonly endDate: Date | null;
    readonly dateFormat: string;
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
    public initialize(props: ThisProps) {
        if (super.componentWillMount) super.componentWillMount();

        var rootState = props.store.getState();

        var initial: ThisState = {
            startDate: props.startDate,
            endDate: props.endDate,
            dateFormat: rootState.clientContext.globals.ShortDateFormat.toUpperCase()
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
        this.onSelectionChange(start, start => DateHelper.addDays(this.state.endDate, DateHelper.dateDiffInDays(this.state.startDate, start)));
    }

    private onEndChange(end: Date | null) {
        this.onSelectionChange(DateHelper.min(end, this.state.startDate), start => end);
    }

    public render(): JSX.Element | null | false {
        {/* DatePicker.defaultValue, minDate and maxDate don't work */ }
        return <div className="text-nowrap form-horizontal">
            {/* From */}
            <span className="col-sm-6 form-group">
                <span className="col-sm-12 input-group">
                    {!StringHelper.isNullOrEmpty(this.props.glyphIcon) &&
                        < span className="input-group-addon" > <i className={"glyphicon glyphicon-" + this.props.glyphIcon}></i></span>
                    }
                    <DatePicker
                        className="form-control"
                        value={DateHelper.toISOString(this.state.startDate, true)}
                        disable={this.props.isReadOnly}
                        onChange={t => this.onStartChange(DateHelper.parseISOString(t, true))}
                    />
                </span>
            </span>
            <span className="col-sm-1">
                <label className="control-label text-nowrap">&nbsp;-&nbsp;</label>
            </span>
            {/* To */}
            <span className="col-sm-5 form-group">
                <span className="col-sm-12 input-group">
                    <DatePicker
                        className="form-control"
                        value={DateHelper.toISOString(this.state.endDate, true)}
                        disable={this.props.isReadOnly}
                        onChange={t => this.onEndChange(DateHelper.parseISOString(t, true))}
                    />
                </span>
            </span>
            {!StringHelper.isNullOrEmpty(this.props.suffix) &&
                <span className="col-sm-1" ><label className="control-label text-nowrap">{this.props.suffix}</label></span>
            }
        </div>;
    }
}