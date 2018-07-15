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
import InputRange, { Range } from 'react-input-range';
import Button from 'react-bootstrap/lib/Button';
import { MathHelper } from '../../helpers/mathHelper';
import { Location } from '../../models/master/location';
import NumericInput from 'react-numeric-input';
import { DateRange } from 'react-date-range';
import { Interval } from '../../models/shared/interval';
import { DateHelper } from '../../helpers/dateHelper';
import * as moment from 'moment';

export interface BikeListFilterComponentProps  {
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
    readonly onSought: (filter: BikeListFilter, clearFilter: boolean) => void;
}

export class BikeListFilterComponent extends ComponentBase<BikeListFilterComponentProps & BikeListFilterComponentActions, BikeListFilterComponentState>
{
    public componentWillReceiveProps(nextProps: Readonly<BikeListFilterComponentProps & BikeListFilterComponentActions>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        this.initialize(nextProps);
    }

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.initialize(this.props);
    }

    private initialize(props: Readonly<BikeListFilterComponentProps & BikeListFilterComponentActions>) {
        var state = props.store.getState();

        // set empty state for render()
        var initial: BikeListFilterComponentState = {
            filter: TypeHelper.notNullOrEmpty(state.bikes.bikesFilter, this.props.filter),
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
        this.props.onSought(this.state.filter, clearFilter);
    }

    public render(): JSX.Element | null | false {
        return <div className="panel panel-success">

            <div className="panel-heading">Filter</div>
            <div className="panel-body form-horizontal">


                {/* Filters */}
                <div className="col-sm-9">

                    {/* Available */}
                    <div className="row">
                        <div className="form-group col-sm-12" >
                            <label className="col-sm-2 control-label text-nowrap">Available</label>
                            <div className="col-sm-10 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-calendar"></i></span>
                                <input type="text" className="form-control" readOnly={true} disabled={this.props.isReadOnly}
                                    value={Interval.format(
                                        this.state.filter.Availability,
                                        t => StringHelper.formatDate(t, this.state.dateFormat),
                                        (t1, t2) => DateHelper.compateDate(t1, t2))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="row">
                        <div className="form-group col-sm-12" >
                            <label className="col-sm-2 control-label text-nowrap">Color</label>
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

                    {/* BikeModels */}
                    <div className="row">
                        <div className="form-group col-sm-12" >
                            <label className="col-sm-2 control-label text-nowrap ">Model</label>
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
                    </div>

                    {/* WeightLbs */}
                    <div className="row">
                        <div className="col-sm-12" >
                            <div className="form-group col-sm-4" >
                                <label className="col-sm-6 control-label text-nowrap ">Weight</label>
                                <div className="col-sm-6 input-group">
                                    <Button bsSize="medium" bsStyle="basic" onClick={() => this.changeFilter({ WeightLbs: { From: 0, To: 99 } })}>x</Button>
                                    &nbsp;
                                &nbsp;
                                {TypeHelper.notNullOrEmpty(this.state.filter.WeightLbs.From, 0)} to {TypeHelper.notNullOrEmpty(this.state.filter.WeightLbs.To, 99)} lbs
                            </div>
                            </div>
                            <div className="form-group col-sm-8" >
                                <InputRange
                                    minValue={0}
                                    maxValue={99}
                                    value={{
                                        min: TypeHelper.notNullOrEmpty(this.state.filter.WeightLbs.From, 0),
                                        max: TypeHelper.notNullOrEmpty(this.state.filter.WeightLbs.To, 99)
                                    }}
                                    disabled={this.props.isReadOnly}
                                    onChange={(range: Range) => this.changeFilter({ WeightLbs: { From: range.min, To: range.max } })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RateAverage */}
                    <div className="row">
                        <div className="col-sm-12" >
                            <div className="form-group col-sm-4" >
                                <label className="col-sm-6 control-label text-nowrap ">Rate</label>
                                <div className="col-sm-6 input-group">
                                    <Button bsSize="medium" bsStyle="basic" onClick={() => this.changeFilter({ RateAverage: { From: 0, To: 5 } })}>x</Button>
                                    &nbsp;
                            &nbsp;
                            {TypeHelper.notNullOrEmpty(this.state.filter.RateAverage.From, 0)} to {TypeHelper.notNullOrEmpty(this.state.filter.RateAverage.To, 5)}
                                </div>
                            </div>
                            <div className="form-group col-sm-8" >
                                <InputRange
                                    minValue={0}
                                    maxValue={5}
                                    step={0.1}
                                    value={{
                                        min: TypeHelper.notNullOrEmpty(this.state.filter.RateAverage.From, 0),
                                        max: TypeHelper.notNullOrEmpty(this.state.filter.RateAverage.To, 5)
                                    }}
                                    disabled={this.props.isReadOnly}
                                    onChange={(range: Range) => this.changeFilter({ RateAverage: { From: MathHelper.roundNumber(range.min, 1), To: MathHelper.roundNumber(range.max, 1) } })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* MaxDistance */}
                    <div className="row" >
                        <div className="form-group col-sm-6" >
                            <label className="col-sm-4 control-label text-nowrap ">Max distance</label>
                            <div className="col-sm-8 input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-record"></i></span>
                                <NumericInput className="form-control text-right" step={0.1} precision={1} value={this.state.filter.MaxDistanceMiles} min={0} max={9999} disabled={this.props.isReadOnly} snap
                                    onChange={(valueAsNumber: number, valueAsString: string, input: NumericInput) => this.changeFilter({ MaxDistanceMiles: valueAsNumber })} />
                            </div>
                        </div>
                        <div className="form-group col-sm-6" >
                            <label className="col-sm-2 control-label text-nowrap "> miles</label>
                            <div className="col-sm-10 input-group">
                            </div>
                        </div>
                    </div>

                </div>

                {/* Calendar */}
                <div className="form-group col-sm-3">
                    <div className="row input-group">
                        <DateRange
                            calendars={1}
                            minDate={moment(DateHelper.today())}
                            startDate={moment(this.state.filter.Availability.From)}
                            endDate={moment(this.state.filter.Availability.To)}
                            onChange={(range: { startDate: moment.Moment, endDate: moment.Moment }) => {
                                this.changeFilter({
                                    Availability: {
                                        From: DateHelper.datePart(range.startDate.toDate()),
                                        To: DateHelper.datePart(range.endDate.toDate())
                                    }
                                });
                            }}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="col-sm-12 text-left">
                    <Button bsStyle="success" onClick={e => this.search(false)}><i className="glyphicon glyphicon-play-circle"></i> Go</Button>
                    &nbsp;
                    &nbsp;
                    <Button bsStyle="danger" onClick={e => this.search(true)} ><i className="glyphicon glyphicon-asterisk"></i> Show all</Button>
                </div>
            </div>
        </div>;
    }
}