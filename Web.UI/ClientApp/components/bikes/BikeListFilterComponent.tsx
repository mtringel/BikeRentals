import * as React from 'react';
import { FormEvent } from 'react';
import { RootState } from '../../store/state/rootState';
import { BikeListFilter } from '../../models/bikes/bikeListFilter';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
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
import { BikeStateHelper, BikeState } from '../../models/bikes/bikeState';
import { NumericRangeComponent } from '../shared/NumericRangeComponent';
import { DateTimeRangeComponent } from '../shared/DateTimeRangeComponent';


export interface BikeListFilterComponentProps  {
    readonly authContext: BikeAuthContext;
    readonly store: Store;
    readonly isReadOnly: boolean;
    readonly filter: BikeListFilter;
    readonly allColors: Color[];
    readonly allBikeModels: BikeModel[];
}

class BikeListFilterComponentState {
    readonly filter: BikeListFilter;
    readonly dateFormat: string;
}

export interface BikeListFilterComponentActions {
    readonly onSearch: (filter: BikeListFilter, resetFilter: boolean) => void;
}

type ThisProps = BikeListFilterComponentProps & BikeListFilterComponentActions;
type ThisState = BikeListFilterComponentState;

export class BikeListFilterComponent extends ComponentBase<ThisProps, ThisState>
{
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
            filter: props.filter,
            dateFormat: state.clientContext.globals.ShortDateFormat
        };

        // invoke asynchronous load after successful authorization
        this.setState(initial);
    }

    private changeFilter(changed: Partial<BikeListFilter>) {
        this.setState({
            ...this.state,
            filter: { ...this.state.filter, ...changed }
        });
    }

    private search(clearFilter: boolean) {
        this.props.onSearch(this.state.filter, clearFilter)
    }

    public render(): JSX.Element | null | false {
        return <div className="panel panel-success">

            <div className="panel-heading">Filter</div>
            <div className="panel-body form-horizontal">


                {/* Filters */}

                <div className="row" >
                    {/* Status */}
                    {this.props.authContext.canManage &&
                        <div className="form-group col-sm-6" >
                            <label className="col-sm-2 control-label text-nowrap">Status</label>
                            <div className="col-sm-4 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-calendar"></i></span>
                                <select type="text" className="form-control" readOnly={this.props.isReadOnly} disabled={this.props.isReadOnly}
                                    value={this.state.filter.State}
                                    onChange={e => this.changeFilter({ State: parseInt(e.target.value) })}
                                >
                                    {BikeStateHelper.allStates.map(t => BikeStateHelper.getOption(t))}
                                </select>
                            </div>
                        </div>
                    }

                    {/* Available */}
                    {this.state.filter.State == BikeState.Available &&
                        <div className="form-group col-sm-6" >
                            <label className="col-sm-2 control-label text-nowrap">When</label>
                            <div className="col-sm-10 input-group">
                                <DateTimeRangeComponent
                                    store={this.props.store}
                                    defaultStartDate={DateHelper.todayUtc()}
                                    defaultEndDate={DateHelper.todayUtc()}
                                    minDate={DateHelper.todayUtc()}
                                    maxDate={null}
                                    startDate={this.state.filter.AvailableUtc.From}
                                    endDate={this.state.filter.AvailableUtc.To}
                                    glyphIcon={"calendar"}
                                    suffix={""}
                                    format={"DD/MM hh:mm"}
                                    onChange={(start, end) => this.changeFilter({ AvailableUtc: { From: start, To: end } })}
                                    isReadOnly={this.props.isReadOnly}
                                />
                            </div>
                        </div>
                    }
                </div>

                <div className="row" >
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
                    {/* WeightLbs */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Weight</label>
                        <div className="col-sm-10 input-group">
                            <NumericRangeComponent
                                defaultStart={null}
                                defaultEnd={null}
                                start={this.state.filter.WeightLbs.From}
                                end={this.state.filter.WeightLbs.To}
                                min={0}
                                max={99}
                                step={0.1}
                                precision={1}
                                isReadOnly={this.props.isReadOnly}
                                glyphIcon={"dashboard"}
                                suffix={"lbs"}
                                inputSuffix={""}
                                onChange={(start, end) => this.changeFilter({ WeightLbs: { From: start, To: end } })}
                            />
                        </div>
                    </div>

                    {/* RateAverage */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Rate</label>
                        <div className="col-sm-10 input-group">
                            <NumericRangeComponent
                                defaultStart={null}
                                defaultEnd={null}
                                start={this.state.filter.RateAverage.From}
                                end={this.state.filter.RateAverage.To}
                                min={0}
                                max={5}
                                step={1}
                                precision={0}
                                isReadOnly={this.props.isReadOnly}
                                glyphIcon={"star"}
                                suffix={""}
                                inputSuffix={"*"}
                                onChange={(start, end) => this.changeFilter({ RateAverage: { From: start, To: end } })}
                            />
                        </div>
                    </div>

                </div>

                <div className="row" >
                    <div className="form-group col-sm-6 form-horizontal" >
                        {/* MaxDistance */}
                        <label className="col-sm-2 control-label text-nowrap ">Distance</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-record"></i></span>
                            <NumericInput className="form-control text-right" step={0.1} precision={1} value={this.state.filter.MaxDistanceMiles} min={0} max={9999} disabled={this.props.isReadOnly} snap
                                onChange={(value: number) => this.changeFilter({ MaxDistanceMiles: value })}
                                format={t => t + " mi"}
                                parse={t => StringHelper.removeSuffix(t, "mi", true)}
                            />
                        </div>
                    </div>

                    <div className="form-group col-sm-6" >
                        {/* BikeId */}
                        <label className="col-sm-2 control-label text-nowrap ">Bike#</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-barcode"></i></span>
                            <NumericInput className="form-control" value={this.state.filter.BikeId} min={0} max={999999999} disabled={this.props.isReadOnly} snap
                                onChange={(value: number) => this.changeFilter({ BikeId: value })} />
                        </div>
                    </div>
                </div>

                <div className="row" >
                    {/* Buttons */}
                    <div className="col-sm-6 text-left">
                        <Button bsStyle="success" onClick={e => this.search(false)}><i className="glyphicon glyphicon-play-circle"></i> Go</Button>
                        &nbsp;&nbsp;
                        <Button bsStyle="danger" onClick={e => this.search(true)} ><i className="glyphicon glyphicon-asterisk"></i> Show all</Button>
                    </div>
                </div>
            </div>
        </div>;
    }
}