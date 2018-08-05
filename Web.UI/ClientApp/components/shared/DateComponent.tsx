/// <summary>
/// Date picker component for date selection (without time part).
/// Wraps react-bootstrap-date-picker.
/// https://www.npmjs.com/package/react-bootstrap-date-picker
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import Date from 'react-bootstrap-date-picker';
import { DateHelper } from '../../helpers/dateHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { StringHelper } from '../../helpers/stringHelper';
import { Store } from '../../store/store';
import { RootState } from 'ClientApp/store/state/rootState';

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
export interface DateComponentProps {
    readonly value: Date | null;
    readonly defaultValue: Date | null;
    readonly minDate: Date | null;
    readonly maxDate: Date | null;
    readonly isReadOnly: boolean;
    readonly className: string | null;
    readonly format: string | null;
}

export interface DateComponentActions {
    readonly onChange: (value: Date | null) => void;
}

/// <summary>
/// Mind the timezone, the Utc dates will be rendered.
/// </summary>
class DateComponentState {
    readonly value: Date | null;
    readonly format: string;
}

type ThisProps = DateComponentProps & DateComponentActions;
type ThisState = DateComponentState;

export class DateComponent extends ComponentBase<ThisProps, ThisState> {

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
            var date = TypeHelper.notNullOrEmpty(date, this.props.defaultValue);

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
        {/* Date.defaultValue, minDate and maxDate don't work */ }
        return <Date
            className={this.props.className}
            value={DateHelper.toISOString(this.state.value)}
            disabled={this.props.isReadOnly}
            format={this.state.format}
            onChange={t => this.onChange(DateHelper.parseISOString(t, true))}
        />;
    }
}