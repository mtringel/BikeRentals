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

export interface BikeListProps extends PropsBase {
    readonly store: Store;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly defaultFilter: BikeListFilter;
}

export interface BikeListActions {
    readonly onAuthorize: (onSuccess: (authContext: BikeAuthContext) => void) => void;
    readonly onAllowCachedData: (invalidateCaches: boolean) => boolean;
    readonly onLoadFilter: (allowCachedData: boolean, onSuccess: (colors: Color[], models: BikeModel[]) => void) => void;
    readonly onLoad: (allowCachedData: boolean, filter: BikeListFilter, paging: PagingInfo, onSuccess: (data: BikeListData) => void) => void;
    //readonly onEdit: (filter: string, user: Bike) => void;
    //readonly onAddNew: (filter: string) => void;    
}

class BikeListState {
    // filter
    public readonly filter: BikeListFilter;
    public readonly allColors: Color[];
    public readonly allBikeModels: BikeModel[];
    public readonly defaultFilter: BikeListFilter;

    // grid
    public readonly data: BikeListData;
    public readonly paging: PagingInfo;
    public readonly defaultPaging: PagingInfo;

    // other
    public readonly authContext: BikeAuthContext;
    public readonly isInitialized: boolean;
}

type ThisProps = BikeListProps & BikeListActions;
type ThisState = BikeListState;

export class BikeList extends ScreenBase<ThisProps, ThisState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var allowCachedData = this.props.onAllowCachedData(true);

        var rootState = this.props.store.getState();

        var defaultPaging: PagingInfo = {
            FirstRow: 0,
            RowCount: rootState.clientContext.globals.GridPageSize,
            OrderBy: this.props.defaultOrderBy,
            OrderByDescending: this.props.defaultOrderByDescending,
            ReturnTotalRowCount: true
        };

        var defaultFilter = TypeHelper.notNullOrEmpty(rootState.bikes.listFilter, this.props.defaultFilter);

        // set empty state for render()
        var empty: ThisState = {
            authContext: new BikeAuthContext(),
            data: new BikeListData(),
            filter: defaultFilter,
            defaultFilter: defaultFilter,
            isInitialized: false,
            allColors: [],
            allBikeModels: [],
            defaultPaging: defaultPaging,
            paging: TypeHelper.notNullOrEmpty(rootState.bikes.listPaging, defaultPaging)
        };

        // invoke asynchronous load after successful authorization
        this.setState(empty,
            () => {
                // authorize
                this.props.onAuthorize(
                    authContext => {
                        // load ref data
                        this.props.onLoadFilter(allowCachedData, (colors, models) => {
                            defaultFilter = {
                                ...defaultFilter,
                                State: authContext.canManage && !TypeHelper.isNullOrEmpty(this.state.filter.State) ? this.state.filter.State : BikeState.Available
                            };

                            this.setState({
                                authContext: authContext,
                                allColors: colors,
                                allBikeModels: models,
                                filter: defaultFilter,
                                defaultFilter: defaultFilter 
                            },
                                // load list
                                () => this.loadData(allowCachedData)
                            );
                        });
                    });
            });
    }

    private loadData(allowCachedData: boolean, onSuccess?: (() => void) | undefined | null) {
        this.props.onLoad(
            allowCachedData,
            this.state.filter,
            this.state.paging,
            t => this.setState({ data: t, isInitialized: true }, onSuccess)
        );
    }

    //private addNew() {
    //    if (this.state.isInitialized)
    //        this.props.onAddNew(this.state.filter);
    //}

    private search(filter: BikeListFilter, resetFilter: boolean) {
        // go to first page when Search button is clicked
        // also reset ordering when Show All button is clicked
        this.setState({
            filter: resetFilter ? this.state.defaultFilter : filter,
            paging: resetFilter ? this.state.defaultPaging : { ...this.state.paging, FirstRow: 0 }
        },
            // no cached data here
            () => this.loadData(false)
        );
    }

    //private edit(user: Bike) {
    //    if (this.state.isInitialized)
    //        this.props.onEdit(this.state.filter, user);
    //}

    private pageChanged(page: number) {
        this.setState({
            paging: {
                ...this.state.paging,
                FirstRow: (page - 1) * this.state.paging.RowCount
            }
        },
            () => this.loadData(true)
        );
    }

    private orderByChanged(orderBy: string[], orderByDescending: boolean
    ) {
        this.setState({
            paging: {
                ...this.state.paging,
                OrderBy: orderBy,
                OrderByDescending: orderByDescending
            }
        },
            () => this.loadData(true)
        );
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
                            onSearch={(filter, resetFilter) => this.search(filter, resetFilter)}
                        />
                    </div>

                    {/* Pager */}

                    <div className="row">
                        <div className="col-sm-3">
                        </div>
                        <div className="col-sm-9 text-right">
                            <span><b>{this.state.data.TotalRowCount} bikes</b></span>
                            &nbsp;&nbsp;&nbsp;
                            <PagerComponent
                                currentPage={Math.floor(this.state.paging.FirstRow / this.state.paging.RowCount) + 1}
                                isReadOnly={!this.state.isInitialized}
                                pageSize={this.state.paging.RowCount}
                                totalRowCount={this.state.data.TotalRowCount}
                                onPageChange={page => this.pageChanged(page)}
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
                            onOrderByChange={(orderBy, orderByDescending) => this.orderByChanged(orderBy, orderByDescending)}
                        />
                    </div>
                </div>
            </div>
        </div>;
    }
}