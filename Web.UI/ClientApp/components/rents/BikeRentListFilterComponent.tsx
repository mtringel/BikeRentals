import * as React from 'react';
import { FormEvent } from 'react';
import { RootState } from '../../store/state/rootState';
import { Store } from '../../store/store';
import { ComponentBase } from '../../helpers/componentBase';
import { StringHelper } from '../../helpers/stringHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { Color } from '../../models/master/color';
import { BikeModel } from '../../models/bikes/bikeModel';
import Select from 'react-select';
import Button from 'react-bootstrap/lib/Button';
import { MathHelper } from '../../helpers/mathHelper';
import { Location } from '../../models/master/location';
import NumericInput from 'react-numeric-input';
import { Interval } from '../../models/shared/interval';
import { DateHelper } from '../../helpers/dateHelper';
import { BikeRentListFilter } from '../../models/rents/bikeRentListFilter';
import { BikeRentStateHelper, BikeRentState } from '../../models/rents/bikeRentState';
import { BikeRentAuthContext } from '../../models/rents/bikeRentAuthContext';
import { AutoCompleteComponent } from '../../components/shared/AutoCompleteComponent';
import { AutoCompleteType } from '../../models/shared/autoCompleteType';
import { AutoCompleteItem } from '../../models/shared/autoCompleteItem';
import { DateTimeRangeComponent } from '../../components/shared/DateTimeRangeComponent';

export interface BikeRentListFilterComponentProps {
    readonly authContext: BikeRentAuthContext;
    readonly store: Store;
    readonly isReadOnly: boolean;
    readonly filter: BikeRentListFilter;
    readonly allColors: Color[];
    readonly allBikeModels: BikeModel[];
}

class BikeRentListFilterComponentState {
    readonly filter: BikeRentListFilter;
    readonly users: AutoCompleteItem[];
    readonly dateFormat: string;
}

export interface BikeRentListFilterComponentActions {
    readonly onSearch: (filter: BikeRentListFilter, resetFilter: boolean) => void;
}

type ThisProps = BikeRentListFilterComponentProps & BikeRentListFilterComponentActions;
type ThisState = BikeRentListFilterComponentState;

export class BikeRentListFilterComponent extends ComponentBase<ThisProps, ThisState>
{
    private mounted: boolean = false;

    public componentWillReceiveProps(nextProps: Readonly<ThisProps>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.initialize(this.props);
    }

    private initialize(props: Readonly<ThisProps>) {
        var state = props.store.getState();

        // set empty state for render()
        var initial: ThisState = {
            filter: this.props.filter,
            dateFormat: state.clientContext.globals.ShortDateFormat,
            users: []
        };

        // invoke asynchronous load after successful authorization
        this.setState(initial);
    }

    private changeFilter(changed: Partial<BikeRentListFilter>, stateChange?: Partial<ThisState> | undefined | null) {
        if (TypeHelper.isNullOrEmpty(stateChange))
            this.setState({ ...this.state, filter: { ...this.state.filter, ...changed } });
        else
            this.setState({ ...this.state, filter: { ...this.state.filter, ...changed }, ...stateChange });
    }

    private search(clearFilter: boolean) {
        this.props.onSearch(this.state.filter, clearFilter);
    }

    public render(): JSX.Element | null | false {
        return <div className="panel panel-success">

            <div className="panel-heading">Filter</div>
            <div className="panel-body form-horizontal">


                {/* Filters */}
                <div className="row">
                    {/* Status */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap">Status</label>
                        <div className="col-sm-10 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-calendar"></i></span>
                            <select type="text" className="form-control" readOnly={this.props.isReadOnly} disabled={this.props.isReadOnly}
                                value={TypeHelper.toString(this.state.filter.State, "All")}
                                onChange={e => this.changeFilter({ State: parseInt(e.target.value) })}
                            >
                                <option key="All" value="All">All</option>
                                {BikeRentStateHelper.allStates.map(t => BikeRentStateHelper.getOption(t))}
                            </select>
                        </div>
                    </div>

                    {/* Late */}
                    {this.state.filter.State == BikeRentState.Reserved &&
                        <div className="form-group col-sm-6" >
                            <label className="col-sm-2 control-label text-nowrap">Late</label>
                            <div className="col-sm-10 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-time"></i></span>
                                <select type="text" className="form-control" readOnly={this.props.isReadOnly} disabled={this.props.isReadOnly}
                                    value={TypeHelper.toString(this.state.filter.Late)}
                                    onChange={e => this.changeFilter({ Late: StringHelper.parseBool(e.target.value) })}
                                >
                                    <option key="All" value="null">All</option>
                                    <option key="true" value="true">Late</option>
                                    <option key="false" value="false">Not yet late</option>
                                </select>
                            </div>
                        </div>
                    }
                </div>

                {/* StartDate */}
                <div className="row">
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap">Start date</label>
                        <div className="col-sm-10 input-group">
                            <DateTimeRangeComponent
                                store={this.props.store}
                                defaultStartDate={null}
                                defaultEndDate={null}
                                minDate={null}
                                maxDate={null}
                                startDate={this.state.filter.StartDateUtc.From}
                                endDate={this.state.filter.StartDateUtc.To}
                                glyphIcon={"calendar"}
                                suffix={""}
                                format={"DD/MM hh:mm"}
                                onChange={(start, end) => this.changeFilter({ StartDateUtc: { From: start, To: end } })}
                                isReadOnly={this.props.isReadOnly}
                            />
                        </div>
                    </div>

                    {/* EndDate */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap">End date</label>
                        <div className="col-sm-10 input-group">
                            <DateTimeRangeComponent
                                store={this.props.store}
                                defaultStartDate={null}
                                defaultEndDate={null}
                                minDate={null}
                                maxDate={null}
                                startDate={this.state.filter.EndDateUtc.From}
                                endDate={this.state.filter.EndDateUtc.To}
                                glyphIcon={"calendar"}
                                suffix={""}
                                format={"DD/MM hh:mm"}
                                onChange={(start, end) => this.changeFilter({ EndDateUtc: { From: start, To: end } })}
                                isReadOnly={this.props.isReadOnly}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">

                    {/* BikeModels */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Models</label>
                        <div className="col-sm-10 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-cog"></i></span>
                            <Select
                                name={"models"}
                                multi={true}
                                valueKey={"BikeModelId"}
                                labelKey={"BikeModelName"}
                                options={this.props.allBikeModels}
                                value={this.state.filter.BikeModels}
                                onChange={(selectedOptions: BikeModel[]) => this.changeFilter({ BikeModels: ArrayHelper.select(selectedOptions, t => t.BikeModelId) })}
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap">Colors</label>
                        <div className="col-sm-10 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-tint"></i></span>
                            <Select
                                name={"colors"}
                                multi={true}
                                valueKey={"ColorId"}
                                labelKey={"ColorName"}
                                options={this.props.allColors}
                                value={this.state.filter.Colors}
                                onChange={(selectedOptions: Color[]) => this.changeFilter({ Colors: ArrayHelper.select(selectedOptions, t => t.ColorId) })}
                            />
                        </div>
                    </div>

                </div>

                <div className="row" >
                    {/* UserId */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">User</label>
                        <div className="col-sm-10 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                            <AutoCompleteComponent                  
                                store={this.props.store}
                                allowMultiple={true}
                                autoCompleteType={AutoCompleteType.User}
                                allowNew={true}
                                isReadOnly={this.props.isReadOnly}
                                items={this.state.users}
                                minFilterChars={1}
                                onChange={t => this.changeFilter({ Users: ArrayHelper.select(t, t2 => t2.Key) }, { users: t })}
                                />
                        </div>
                    </div>
                </div>

                <div className="row" >
                    {/* BikeRentId */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Rent#</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-qrcode"></i></span>
                            <input type="text" className="form-control" value={this.state.filter.BikeRentId} disabled={this.props.isReadOnly}
                                onChange={e => this.changeFilter({ BikeRentId: e.target.value })} />
                        </div>
                    </div>

                    {/* BikeId */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Bike#</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-barcode"></i></span>
                            <NumericInput className="form-control" value={this.state.filter.BikeId} min={0} max={999999999} disabled={this.props.isReadOnly} snap
                                onChange={(value: number) => this.changeFilter({ BikeId: value })} />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="row">
                    <div className="col-sm-12 text-left">
                        <Button bsStyle="success" onClick={e => this.search(false)}><i className="glyphicon glyphicon-play-circle"></i> Go</Button>
                        &nbsp;&nbsp;
                    <Button bsStyle="danger" onClick={e => this.search(true)} ><i className="glyphicon glyphicon-asterisk"></i> Show all</Button>
                    </div>
                </div>
            </div>
        </div>;
    }
}