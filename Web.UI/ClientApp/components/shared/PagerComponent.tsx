import * as React from 'react';
import { ComponentBase } from '../../helpers/componentBase';
import { TypeHelper } from '../../helpers/typeHelper';
import Button from 'react-bootstrap/lib/Button';

export interface PagerComponentProps {
    readonly totalRowCount: number;
    readonly pageSize: number;
    readonly currentPage: number;
    readonly isReadOnly: boolean;
}

export interface PagerComponentActions {
    readonly onPageChanged: (page: number) => void;
}

class PagerComponentState {
    public readonly pageCount: number;
    public readonly currentPage: number;
}

export class PagerComponent extends ComponentBase<PagerComponentProps & PagerComponentActions, PagerComponentState> {

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
    public componentWillReceiveProps(nextProps: Readonly<PagerComponentProps & PagerComponentActions>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        this.initialize(nextProps);
    }

    /// <summary>
    /// Mandatory and must call super.
    /// </summary>
    public initialize(props: PagerComponentProps) {
        if (super.componentWillMount) super.componentWillMount();

        var initial: PagerComponentState = {
            currentPage: props.currentPage,
            pageCount: Math.ceil(props.totalRowCount / props.pageSize)
        };

        this.setState(initial);
    }

    private pageChange(page: number) {
        if (!this.props.isReadOnly)
            this.props.onPageChanged(page);
    }

    private createButtons(): JSX.Element[] {
        var buttons = [];
        var last = 0;
        var from = Math.max(this.state.currentPage - 2, 0);
        var to = Math.min(from + 4, this.state.pageCount);
        from = Math.max(to - 4, 0);
 
        for (var i = 1; i <= this.state.pageCount; i++)
            // show the first page, the last page and current page +/- two pages (total of five around current)
            if (i === 1 || i === this.state.pageCount || (i >= from && i <= to)) {

                buttons.push(<span key={i}>
                    {/* Separator */}
                    {i !== last + 1 && <span>...</span>}
                    {/* Button */}
                    <Button bsSize="small" bsStyle={i === this.state.currentPage ? "danger" : "info"} disabled={this.props.isReadOnly} onClick={this.pageChange.bind(this, i)}>{i}</Button>
                    &nbsp;
                </span>
                );

                last = i;
            }

        return buttons;
    }

    public render(): JSX.Element | null | false {
        return <span>
            {this.createButtons()}
        </span>;
    }
}