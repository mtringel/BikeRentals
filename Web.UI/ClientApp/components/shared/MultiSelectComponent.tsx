/// <summary>
/// MultiSelect component for selecting multiple items (also supports single selection). Does not load data on-demand, all items must be passed to it.
/// Wrap react-select.
/// https://www.npmjs.com/package/react-select
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { MathHelper } from '../../helpers/mathHelper';
import Select from 'react-select';
import { ArrayHelper } from '../../helpers/arrayHelper';

export interface MultiSelectComponentProps<TItem, TKey> {
    readonly id: string;
    readonly name: string;
    readonly className: string;
    readonly isReadOnly: boolean;
    readonly allowMultiple: boolean;
    readonly values: TKey[];
    readonly placeholder: string;
    readonly items: TItem[];
    readonly required: boolean;
    readonly valueKey: string;
    readonly labelKey: string;
}

export interface MultiSelectComponentActions<TItem, TKey> {
    readonly onChange: (keys: TKey[], values: TItem[]) => void;
}

class MultiSelectComponentState<TItem, TKey> {
    readonly items: TItem[];
    readonly values: TKey[];
}

type ThisProps<TItem, TKey> = MultiSelectComponentProps<TItem, TKey> & MultiSelectComponentActions<TItem, TKey>;
type ThisState<TItem, TKey> = MultiSelectComponentState<TItem, TKey>;

export class MultiSelectComponent<TItem, TKey> extends ComponentBase<ThisProps<TItem, TKey>, ThisState<TItem, TKey>> {

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
    public componentWillReceiveProps(nextProps: Readonly<ThisProps<TItem, TKey>>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    /// <summary>
    /// Mandatory and must call super.
    /// DO NOT use this.props here, always user props parameter!
    /// </summary>+
    private initialize(props: ThisProps<TItem, TKey>) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: ThisState<TItem, TKey> = {
            items: props.items,
            values: props.values
        };

        this.setState(initial);
    }

    private onChange(values: TItem[]) {
        if (!this.props.isReadOnly) {
            var keys = ArrayHelper.select(values, t => t[this.props.valueKey]);
            this.setState({ values: keys }, () => this.props.onChange(keys, values));
        }
    }

    public render(): JSX.Element | null | false {
        return <Select
            id={this.props.id}
            name={this.props.name}
            className={this.props.className}
            isDisabled={this.props.isReadOnly}
            value={this.state.values}
            placeholder={this.props.placeholder}
            valueKey={this.props.valueKey}
            labelKey={this.props.labelKey}
            multi={this.props.allowMultiple}
            required={this.props.required}
            options={this.state.items}
            onChange={t => this.onChange(t)}
        />
    }
}