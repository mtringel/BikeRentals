/// <summary>
/// Select component for single selecting items. Does not load data on-demand, all items must be passed to it.
/// Uses HTML <select /> control.
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { MathHelper } from '../../helpers/mathHelper';
import { StringHelper } from '../../helpers/stringHelper';
import { ArrayHelper } from '../../helpers/arrayHelper';

export interface SelectComponentOption {
    value: string;
    text: string;
}

export interface SelectComponentProps<TItem> {
    readonly id: string;
    readonly name: string;
    readonly className: string;
    readonly required: boolean;
    readonly isReadOnly: boolean;
    readonly value: TItem;
    readonly placeholder: string;
    readonly items: TItem[];
    readonly getOption: (item: TItem) => SelectComponentOption;
    readonly getItem: (option: SelectComponentOption) => TItem;
    readonly emptyOption: string;
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
    private initialize(props: ThisProps<TItem>) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: ThisState<TItem> = {
            items: props.items,
            value: props.value
        };

        this.setState(initial);
    }

    private onChange(value: TItem | null) {
        if (!this.props.isReadOnly)
            this.setState({ value: value }, () => this.props.onChange(value));
    }

    private findByValue(options: HTMLOptionsCollection, value: string | undefined | null): TItem {
        if (TypeHelper.isNullOrEmpty(options) || options.length === 0)
            return null;
        else if (StringHelper.isNullOrEmpty(value))
            return this.props.getItem(options[0]);
        else {
            var length = options.length;

            for (var i = 0; i < length; i++)
                if (options[i].value === value)
                    return this.props.getItem(options[i]);

            return null;
        }
    }

    public render(): JSX.Element | null | false {
        var currentOption = TypeHelper.isNullOrEmpty(this.state.value) ? { value: "", text: "" } : this.props.getOption(this.state.value);

        return <select
            id={this.props.id}
            name={this.props.name}
            className={this.props.className}
            required={this.props.required}
            disabled={this.props.isReadOnly}
            value={currentOption.value}
            placeholder={this.props.placeholder}
            onChange={e => this.onChange(this.findByValue(e.target.options, e.target.value))}
        >
            {this.props.isReadOnly &&
                <option key={currentOption.value} value={currentOption.value}>{currentOption.text}</option>
            }
            {!this.props.isReadOnly && !StringHelper.isNullOrEmpty(this.props.emptyOption) && <option key="" value="">{this.props.emptyOption}</option>}
            {!this.props.isReadOnly && this.state.items.map(item => {
                var option = this.props.getOption(item);
                return <option key={option.value} value={option.value}>{option.text}</option>;
            })}
        </select>;
    }
}