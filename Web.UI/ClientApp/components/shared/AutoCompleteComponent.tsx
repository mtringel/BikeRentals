/// <summary>
/// Auto-complete selection component for single selection or multiple selection. Loads data on-demand.
/// Wraps react-bootstrap-typeahead.
/// https://www.npmjs.com/package/react-bootstrap-typeahead
/// </summary>

import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { AutoCompleteType } from '../../models/shared/autoCompleteType';
import { AutoCompleteListData } from '../../models/shared/autoCompleteListData';
import { Store } from '../../store/store';
import { AutoCompleteItem } from '../../models/shared/autoCompleteItem';
import { AutoCompleteActions } from '../../store/actions/shared/autoCompleteActions';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { TypeHelper } from '../../helpers/typeHelper';
import { storeProvider } from '../../boot';

export interface AutoCompleteComponentProps{
    readonly store: Store;
    readonly autoCompleteType: AutoCompleteType;
    readonly isReadOnly: boolean;
    readonly allowMultiple: boolean;
    readonly allowNew: boolean;
    readonly items: AutoCompleteItem[];
    readonly minFilterChars: number;
    readonly required: boolean;
}

export interface AutoCompleteComponentActions {
    readonly onChange: (selected: AutoCompleteItem[]) => void;
}

class AutoCompleteComponentState {
    readonly items: AutoCompleteItem[];
}

type ThisProps = AutoCompleteComponentProps & AutoCompleteComponentActions;
type ThisState = AutoCompleteComponentState;

export class AutoCompleteComponent extends ComponentBase<ThisProps, ThisState> {

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
            items: TypeHelper.notNullOrEmpty(props.items, [])
        };

        this.setState(initial);
    }

    private loadData(filter: string) {
        //this.props.store
        storeProvider().dispatch(
            AutoCompleteActions.getList(true, this.props.autoCompleteType,
                filter,
                data => this.setState({ items: data.List }))
        );
    }

    private onSearch(filter: string) {
        if (!this.props.isReadOnly)
            this.loadData(filter);
    }

    private onChange(selected: AutoCompleteItem[]) {
        if (!this.props.isReadOnly)
            this.props.onChange(selected);
    }

    public render(): JSX.Element | null | false {
        return <AsyncTypeahead
            clearButton={true}
            disabled={this.props.isReadOnly}
            labelKey="Value"
            multiple={this.props.allowMultiple}
            options={this.state.items}
            allowNew={this.props.allowNew}
            minLength={this.props.minFilterChars}
            onChange={t => this.onChange(t)}
            required={this.props.required}
            onSearch={t => this.onSearch(t)}
        />;
    }
}