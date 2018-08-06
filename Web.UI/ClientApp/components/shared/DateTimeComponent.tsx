/// <summary>
/// Date-time picker component for date selection with time part.
/// Wraps react-bootstrap-datetimepicker.
/// https://www.npmjs.com/package/react-bootstrap-datetimepicker
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { DateHelper } from '../../helpers/dateHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { StringHelper } from '../../helpers/stringHelper';
import * as moment from 'moment';

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
export interface DateTimeComponentProps {
    readonly value: Date | null;
    readonly minDate: Date | null;
    readonly maxDate: Date | null;
    readonly isReadOnly: boolean;
    readonly required: boolean;
    readonly defaultValue: Date | null;
    readonly placeholder: string;
    readonly format: string;
    readonly className: string;
}

export interface DateTimeComponentActions {
    readonly onChange: (value: Date | null) => void;
}

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
class DateTimeComponentState {
    readonly value: Date | null;
    readonly format: string;
}

type ThisProps = DateTimeComponentProps & DateTimeComponentActions;
type ThisState = DateTimeComponentState;

export class DateTimeComponent extends ComponentBase<ThisProps, ThisState> {

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

        var initial: ThisState = {
            value: props.value,
            format: StringHelper.notNullOrEmpty(props.format, "")
        };

        this.setState(initial);
    }

    private onChange(value: Date | null) {
        if (!this.props.isReadOnly) {
            var date = TypeHelper.notNullOrEmpty(value, this.props.defaultValue);

            // check min/max
            if (!TypeHelper.isNullOrEmpty(date)) {
                if (!TypeHelper.isNullOrEmpty(this.props.minDate) && date < this.props.minDate)
                    date = this.props.minDate;

                if (!TypeHelper.isNullOrEmpty(this.props.maxDate) && date > this.props.maxDate)
                    date = this.props.maxDate;
            }

            this.setState({ value: date }, () => this.props.onChange(date));
        }
    }

    public render(): JSX.Element | null | false {
        return <span>
            {/* hack */}
            {TypeHelper.isNullOrEmpty(this.state.value) &&
                <DateTimeField
                    defaultText={this.props.placeholder}
                    minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                    maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                    inputProps={{ className: this.props.className, disable: this.props.isReadOnly, required: this.props.required }}
                    inputFormat={this.state.format}
                    onChange={t => this.onChange(DateHelper.parseDateMilliseconds(t))}
                />
            }
            {!TypeHelper.isNullOrEmpty(this.state.value) &&
                <DateTimeField
                    dateTime={moment(this.state.value)}
                    minDate={TypeHelper.isNullOrEmpty(this.props.minDate) ? undefined : moment(this.props.minDate)}
                    maxDate={TypeHelper.isNullOrEmpty(this.props.maxDate) ? undefined : moment(this.props.maxDate)}
                    inputProps={{ className: this.props.className, disable: this.props.isReadOnly, required: this.props.required }}
                    inputFormat={this.state.format}
                    onChange={t => this.onChange(DateHelper.parseDateMilliseconds(t))}
                />
            }
        </span>;
    }
}