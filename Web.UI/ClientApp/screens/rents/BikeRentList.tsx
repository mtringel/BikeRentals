import * as React from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import { RoleType } from '../../models/security/roleType';
import Button from 'react-bootstrap/lib/Button';
import { IScreen } from '../../helpers/IScreen';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';
import { BikeRentListFilter } from '../../models/rents/bikeRentListFilter';
import { BikeRentAuthContext } from '../../models/rents/bikeRentAuthContext';
import { PagingInfo } from '../../models/shared/pagingInfo';
import { BikeRentListData } from '../../models/rents/bikeRentListData';
import { BikeRentListComponent } from '../../components/rents/BikeRentListComponent';
import { TypeHelper } from '../../helpers/typeHelper';
import { PagerComponent } from '../../components/shared/PagerComponent';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { BikeRentListFilterComponent } from '../../components/rents/BikeRentListFilterComponent';
import { Color } from '../../models/master/color';
import { BikeModel } from '../../models/bikes/bikeModel';
import { Location } from '../../models/master/location';
import { BikeRentState } from '../../models/rents/bikeRentState';

export interface BikeRentListProps extends PropsBase {
    readonly store: Store;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly defaultFilter: BikeRentListFilter;
    readonly myRentsOnly: boolean;
}

export interface BikeRentListActions {
    readonly onInit: (onSuccess: (options: { authContext: BikeRentAuthContext, initialLoadCached: boolean, keepNavigation: boolean }) => void) => void;
    readonly onLoadFilter: (onSuccess: (colors: Color[], models: BikeModel[]) => void) => void;
    readonly onLoad: (allowCachedData: boolean, filter: BikeRentListFilter, paging: PagingInfo, onSuccess: (data: BikeRentListData) => void) => void;
    //readonly onEdit: (filter: string, user: Bike) => void;
    //readonly onAddNew: (filter: string) => void;    
}

class BikeRentListState {
    // filter
    readonly filter: BikeRentListFilter;
    readonly allColors: Color[];
    readonly allBikeModels: BikeModel[];
    readonly defaultFilter: BikeRentListFilter;

    // grid
    readonly data: BikeRentListData;
    readonly paging: PagingInfo;
    readonly defaultPaging: PagingInfo;

    // other
    readonly authContext: BikeRentAuthContext;
    readonly isInitialized: boolean;
}

type ThisProps = BikeRentListProps & BikeRentListActions;
type ThisState = BikeRentListState;

export class BikeRentList extends ScreenBase<ThisProps, ThisState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.props.onInit(options => {
            var rootState = this.props.store.getState();

            var defaultPaging: PagingInfo = {
                FirstRow: 0,
                RowCount: rootState.clientContext.globals.GridPageSize,
                OrderBy: this.props.defaultOrderBy,
                OrderByDescending: this.props.defaultOrderByDescending,
                ReturnTotalRowCount: true
            };

            var defaultFilter = options.keepNavigation ? TypeHelper.notNullOrEmpty(rootState.bikeRents.listFilter, this.props.defaultFilter) : this.props.defaultFilter;

            // set empty state for render()
            var empty: ThisState = {
                authContext: options.authContext,
                data: new BikeRentListData(),
                filter: defaultFilter,
                defaultFilter: defaultFilter,
                isInitialized: false,
                allColors: [],
                allBikeModels: [],
                defaultPaging: defaultPaging,
                paging: options.keepNavigation ? TypeHelper.notNullOrEmpty(rootState.bikes.listPaging, defaultPaging) : defaultPaging
            };

            // invoke asynchronous load after successful authorization
            this.setState(empty,
                () => {
                    // load ref data
                    this.props.onLoadFilter((colors, models) => {

                        if (this.props.myRentsOnly)
                            defaultFilter = { ...defaultFilter, Users: [options.authContext.currentUserId] };

                        this.setState({
                            authContext: options.authContext,
                            allColors: colors,
                            allBikeModels: models,
                            filter: defaultFilter,
                            defaultFilter: defaultFilter
                        },
                            () => this.loadData(options.initialLoadCached)
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

    private search(filter: BikeRentListFilter, resetFilter: boolean) {
        // go to first page when Search button is clicked
        // no cached data here
        this.setState({
            filter: resetFilter ? this.props.defaultFilter : filter,
            paging: resetFilter ? this.state.defaultPaging : { ...this.state.paging, FirstRow: 0 }
        },
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
            <h2>Bike Rentals</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div id="panelPrimary" className="panel panel-primary">

                <div className="panel-heading">Bike List</div>
                <div className="panel-body">

                    {/* Filter */}
                    <div className="row">
                        <BikeRentListFilterComponent
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
                        <BikeRentListComponent
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