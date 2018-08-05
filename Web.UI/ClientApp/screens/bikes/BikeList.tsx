import * as React from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import { RoleType } from '../../models/security/roleType';
import Button from 'react-bootstrap/lib/Button';
import { IScreen } from '../../helpers/IScreen';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';
import { BikeListFilter } from '../../models/bikes/bikeListFilter';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
import { PagingInfo } from '../../models/shared/pagingInfo';
import { BikeListData } from '../../models/bikes/bikeListData';
import { BikeListComponent } from '../../components/bikes/BikeListComponent';
import { TypeHelper } from '../../helpers/typeHelper';
import { PagerComponent } from '../../components/shared/PagerComponent';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { BikeListFilterComponent } from '../../components/bikes/BikeListFilterComponent';
import { Color } from '../../models/master/color';
import { BikeModel } from '../../models/bikes/bikeModel';
import { Location } from '../../models/master/location';
import { BikeState } from '../../models/bikes/bikeState';
import { Bike } from '../../models/bikes/bike';
import { BikeListItem } from '../../models/bikes/bikeListItem';

export interface BikeListProps extends PropsBase {
    readonly store: Store;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly defaultFilter: BikeListFilter;
}

export interface BikeListActions {
    readonly onInit: (onSuccess: (options: {
        authContext: BikeAuthContext,
        initialLoadCached: boolean,
        keepNavigation: boolean,
        colors: Color[],
        bikeModels: BikeModel[]
    }) => void) => void;
    
    readonly onLoad: (allowCachedData: boolean, filter: BikeListFilter, paging: PagingInfo, onSuccess: (data: BikeListData) => void) => void;
    readonly onViewRents: (bikeId: number, authContext: BikeAuthContext) => void;
    readonly onEdit: (bike: BikeListItem) => void;
    readonly onAddNew: () => void;
}

class BikeListState {
    // filter
    readonly filter = new BikeListFilter();
    readonly allColors: Color[] = [];
    readonly allBikeModels: BikeModel[] = [];
    readonly defaultFilter = new BikeListFilter();

    // grid
    readonly data = new BikeListData();
    readonly paging = new PagingInfo();
    readonly defaultPaging = new PagingInfo();

    // other
    readonly authContext = new BikeAuthContext();
    readonly isInitialized: boolean;
}

type ThisProps = BikeListProps & BikeListActions;
type ThisState = BikeListState;

export class BikeList extends ScreenBase<ThisProps, ThisState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        // set empty state so the form renderes for the user promptly without data
        this.setState(new BikeListState(), () => {
            this.props.onInit(options => {

                var rootState = this.props.store.getState();

                var defaultPaging: PagingInfo = {
                    FirstRow: 0,
                    RowCount: rootState.clientContext.globals.GridPageSize,
                    OrderBy: this.props.defaultOrderBy,
                    OrderByDescending: this.props.defaultOrderByDescending,
                    ReturnTotalRowCount: true
                };

                var defaultFilter = options.keepNavigation ? TypeHelper.notNullOrEmpty(rootState.bikes.listFilter, this.props.defaultFilter) : this.props.defaultFilter;

                // can list only Available?
                if (!options.authContext.canManage || TypeHelper.isNullOrEmpty(defaultFilter.State))
                    defaultFilter = { ...defaultFilter, State: BikeState.Available };

                this.setState({
                    authContext: options.authContext,
                    data: new BikeListData(),
                    filter: defaultFilter,
                    defaultFilter: defaultFilter,
                    defaultPaging: defaultPaging,
                    paging: options.keepNavigation ? TypeHelper.notNullOrEmpty(rootState.bikes.listPaging, defaultPaging) : defaultPaging,
                    allColors: options.colors,
                    allBikeModels: options.bikeModels,
                    isInitialized: false,
                },
                    // invoke asynchronous load after successful authorization
                    () => this.loadData(options.initialLoadCached, true)
                );
            });
        });
    }

    private loadData(allowCachedData: boolean, returnTotalRowCount: boolean, onSuccess?: (() => void) | undefined | null) {
        this.props.onLoad(
            allowCachedData,
            this.state.filter,
            { ...this.state.paging, ReturnTotalRowCount: returnTotalRowCount },
            t => this.setState({
                data: {
                    ...t,
                    TotalRowCount: returnTotalRowCount ? t.TotalRowCount : this.state.data.TotalRowCount // no need to re-calculate
                },
                isInitialized: true
            }, onSuccess)
        );
    }

    private onSearch(filter: BikeListFilter, resetFilter: boolean) {
        // go to first page when Search button is clicked
        // also reset ordering when Show All button is clicked
        this.setState({
            filter: resetFilter ? this.state.defaultFilter : filter,
            paging: resetFilter ? this.state.defaultPaging : { ...this.state.paging, FirstRow: 0 }
        },
            // no cached data here
            () => this.loadData(false, true)
        );
    }

    private onPageChange(page: number) {
        this.setState({
            paging: {
                ...this.state.paging,
                FirstRow: (page - 1) * this.state.paging.RowCount
            }
        },
            () => this.loadData(true, false)
        );
    }

    private onOrderByChange(orderBy: string[], orderByDescending: boolean
    ) {
        this.setState({
            paging: {
                ...this.state.paging,
                OrderBy: orderBy,
                OrderByDescending: orderByDescending
            }
        },
            () => this.loadData(true, false)
        );
    }

    private canAddNew(): boolean {
        return this.state.authContext.canManage;
    }

    private onAddNew() {
        this.props.onAddNew();
    }

    private onEdit(bike: BikeListItem) {
        this.props.onEdit(bike);
    }

    public render(): JSX.Element | null | false {
        return <div>
            <h2>Bikes</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div id="panelPrimary" className="panel panel-primary">

                <div className="panel-heading">Bike List</div>
                <div className="panel-body">

                    {/* Filter */}
                    <div className="row">
                        <BikeListFilterComponent
                            store={this.props.store}
                            authContext={this.state.authContext}
                            filter={this.state.filter}
                            isReadOnly={!this.state.isInitialized}
                            allColors={this.state.allColors}
                            allBikeModels={this.state.allBikeModels}
                            onSearch={(filter, resetFilter) => this.onSearch(filter, resetFilter)}
                        />
                    </div>

                    {/* Pager */}

                    <div className="row">
                        <div className="col-sm-4">
                            {this.canAddNew() && <Button bsStyle="primary" disabled={!this.state.isInitialized} onClick={e => this.onAddNew()}>
                                <i className="glyphicon glyphicon-file"></i> New
                            </Button>}
                        </div>
                        <div className="col-sm-8 text-right">
                            <span><b>{this.state.data.TotalRowCount} bikes</b></span>
                            &nbsp;&nbsp;&nbsp;
                            <PagerComponent
                                currentPage={Math.floor(this.state.paging.FirstRow / this.state.paging.RowCount) + 1}
                                isReadOnly={!this.state.isInitialized}
                                pageSize={this.state.paging.RowCount}
                                totalRowCount={this.state.data.TotalRowCount}
                                onPageChange={page => this.onPageChange(page)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="row">
                        <BikeListComponent
                            store={this.props.store}
                            authContext={this.state.authContext}
                            data={this.state.data}
                            isReadOnly={!this.state.isInitialized}
                            orderBy={this.state.paging.OrderBy}
                            orderByDescending={this.state.paging.OrderByDescending}
                            defaultOrderBy={this.props.defaultOrderBy}
                            defaultOrderByDescending={this.props.defaultOrderByDescending}
                            onOrderByChange={(orderBy, orderByDescending) => this.onOrderByChange(orderBy, orderByDescending)}
                            onViewRents={(bikeId, authContext) => this.props.onViewRents(bikeId, authContext)}
                            onEdit={bike => this.onEdit(bike)}
                        />
                    </div>
                </div>
            </div>
        </div>;
    }
}