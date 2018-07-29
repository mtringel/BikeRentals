/// <summary>
/// Select component for single selecting items. Does not load data on-demand, all items must be passed to it.
/// Uses HTML <select /> control.
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { MathHelper } from '../../helpers/mathHelper';

export interface SelectComponentOption {
    value: string;
    text: string;
}

export interface SelectComponentProps<TItem> {
    readonly id: string;
    readonly name: string;
    readonly className: string;
    readonly required: boolean;
    readonly disabled: boolean;
    readonly value: TItem;
    readonly placeholder: string;
    readonly items: TItem[];
    readonly getOption: (item: TItem) => SelectComponentOption;
    readonly getItem: (option: SelectComponentOption) => TItem;
}

export interface SelectComponentActions<TItem> {
    readonly onChange: (value: TItem) => void;
}

class SelectComponentState<TItem> {
    readonly items: TItem[];
    readonly value: TItem;
}

type ThisProps<TItem> = SelectComponentProps<TItem> & SelectComponentActions<TItem>;
type ThisState<TItem> = SelectComponentState<TItem>;

export class SelectComponent<TItem> extends ComponentBase<ThisProps<TItem>, ThisState<TItem>> {

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
    public componentWillReceiveProps(nextProps: Readonly<ThisProps<TItem>>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    /// <summary>
    /// Mandatory and must call super.
    /// DO NOT use this.props here, always user props parameter!
    /// </summary>+
    public initialize(props: ThisProps<TItem>) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: ThisState<TItem> = {
            items: this.props.items,
            value: this.props.value
        };

        this.setState(initial);
    }

    private onChange(value: TItem) {
        if (!this.props.disabled)
            this.setState({ value: value }, () => this.props.onChange(value));
    }

    public render(): JSX.Element | null | false {
        var currentOption = this.props.getOption(this.state.value);

        return <select
            id={this.props.id}
            name={this.props.name}
            className={this.props.className}
            required={this.props.required}
            disabled={this.props.disabled}
            value={TypeHelper.toString(this.state.value)}
            placeholder={this.props.placeholder}
            onChange={e => {
                var item = e.target.options[MathHelper.clamp(parseInt(e.target.value), 0, e.target.options.length - 1)];
                this.onChange(this.props.getItem(item));
            }}
        >
            {this.props.disabled &&
                <option key={currentOption.value} value={currentOption.value}>{currentOption.text}</option>
            }
            {!this.props.disabled && this.state.items.map(item => {
                var option = this.props.getOption(item); 
                return <option key={option.value} value={option.value}>{option.text}</option>;
            })}
        </select>;
    }
}