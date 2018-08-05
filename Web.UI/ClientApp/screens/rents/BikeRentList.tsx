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
import { BikeRef } from '../../models/bikes/bikeRef';
import { BikeRent } from '../../models/rents/bikeRent';

export interface BikeRentListProps extends PropsBase {
    readonly store: Store;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly defaultFilter: BikeRentListFilter;
    readonly myRentsOnly: boolean;
}

export interface BikeRentListActions {
    readonly onInit: (onSuccess: (options: {
        authContext: BikeRentAuthContext,
        initialLoadCached: boolean,
        keepNavigation: boolean,
        colors: Color[],
        bikeModels: BikeModel[]
    }) => void) => void;
    
    readonly onLoad: (allowCachedData: boolean, filter: BikeRentListFilter, paging: PagingInfo, onSuccess: (data: BikeRentListData) => void) => void;
    readonly onEdit: (rent: BikeRent) => void;
    readonly onAddNew: () => void;    
}

class BikeRentListState {
    // filter
    readonly filter = new BikeRentListFilter();
    readonly allColors: Color[] = [];
    readonly allBikeModels: BikeModel[] = [];
    readonly defaultFilter = new BikeRentListFilter();

    // grid
    readonly data = new BikeRentListData();
    readonly paging = new PagingInfo();
    readonly defaultPaging = new PagingInfo();

    // other
    readonly authContext = new BikeRentAuthContext();
    readonly isInitialized: boolean;
}

type ThisProps = BikeRentListProps & BikeRentListActions;
type ThisState = BikeRentListState;

export class BikeRentList extends ScreenBase<ThisProps, ThisState>
{
    private form: HTMLFormElement;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        // set empty state so the form renderes for the user promptly without data
        this.setState(new BikeRentListState(), () => {
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

                // can list only own?
                if (this.props.myRentsOnly)
                    defaultFilter = { ...defaultFilter, Users: [options.authContext.currentUserId] };

                this.setState({
                    authContext: options.authContext,
                    data: new BikeRentListData(),
                    filter: defaultFilter,
                    defaultFilter: defaultFilter,
                    isInitialized: false,
                    allColors: options.colors,
                    allBikeModels: options.bikeModels,
                    defaultPaging: defaultPaging,
                    paging: options.keepNavigation ? TypeHelper.notNullOrEmpty(rootState.bikeRents.listPaging, defaultPaging) : defaultPaging
                },
                    // invoke asynchronous load after successful authorization
                    () => this.loadData(options.initialLoadCached)
                );
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

    private onAddNew() {
        if (this.state.isInitialized)
            this.props.onAddNew();
    }

    private onSearch(filter: BikeRentListFilter, resetFilter: boolean) {
        // go to first page when Search button is clicked
        // no cached data here
        if (this.state.isInitialized)
            this.setState({
                filter: resetFilter ? this.props.defaultFilter : filter,
                paging: resetFilter ? this.state.defaultPaging : { ...this.state.paging, FirstRow: 0 }
            },
                () => this.loadData(false)
            );
    }

    private onEdit(rent: BikeRent) {
        if (this.state.isInitialized)
            this.props.onEdit(rent);
    }

    private onPageChange(page: number) {
        this.setState({
            paging: {
                ...this.state.paging,
                FirstRow: (page - 1) * this.state.paging.RowCount
            }
        },
            () => this.loadData(true)
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
                            onSearch={(filter, resetFilter) => this.onSearch(filter, resetFilter)}
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
                                onPageChange={page => this.onPageChange(page)}
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
                            onOrderByChange={(orderBy, orderByDescending) => this.onOrderByChange(orderBy, orderByDescending)}
                        />
                    </div>
                </div>
            </div>
        </div>;
    }
}