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
import { SelectComponent } from '../shared/SelectComponent';
import { MultiSelectComponent } from '../shared/MultiSelectComponent';

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

class BikeRentStateSelect extends SelectComponent<BikeRentState>{ }
class BikeModelSelect extends MultiSelectComponent<BikeModel, number>{ }
class ColorSelect extends MultiSelectComponent<Color, string>{ }

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

        var initial: ThisState = {
            filter: props.filter,
            dateFormat: state.clientContext.globals.ShortDateFormat,
            users: []
        };

        // invoke asynchronous load after successful authorization
        this.setState(initial);
    }

    private change(changed: Partial<BikeRentListFilter>, stateChange?: Partial<ThisState> | undefined | null) {
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
                            <span className="input-group-addon"><i className="glyphicon glyphicon-flash"></i></span>
                            <BikeRentStateSelect id="state" name="state" className="form-control" required={true} isReadOnly={this.props.isReadOnly} value={this.state.filter.State}
                                placeholder="Fill to filter"
                                getItem={t => BikeRentStateHelper.allStates[parseInt(t.value)]}
                                getOption={t => { return { value: TypeHelper.toString(t), text: BikeRentStateHelper.allNames[t] }; }}
                                items={BikeRentStateHelper.allStates}
                                onChange={t => this.change({ State: t })}
                            />
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
                                    placeholder="Fill to filter"
                                    onChange={e => this.change({ Late: StringHelper.parseBool(e.target.value) })}
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
                                placeholder="Fill to filter"
                                glyphIcon="calendar"
                                format="DD/MM hh:mm"
                                onChange={(start, end) => this.change({ StartDateUtc: { From: start, To: end } })}
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
                                placeholder="Fill to filter"
                                glyphIcon="calendar"
                                format="DD/MM hh:mm"
                                onChange={(start, end) => this.change({ EndDateUtc: { From: start, To: end } })}
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
                            <BikeModelSelect
                                id="models"
                                name="models"
                                className=""
                                isReadOnly={this.props.isReadOnly}
                                allowMultiple={true}
                                placeholder="Fill to filter"
                                valueKey="BikeModelId"
                                labelKey="BikeModelName"
                                items={this.props.allBikeModels}
                                values={this.state.filter.BikeModels}
                                onChange={(keys, items) => this.change({ BikeModels: keys })}
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap">Colors</label>
                        <div className="col-sm-10 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-tint"></i></span>
                            <ColorSelect
                                id="colors"
                                name="colors"
                                className=""
                                isReadOnly={this.props.isReadOnly}
                                allowMultiple={true}
                                placeholder="Fill to filter"
                                valueKey="ColorId"
                                labelKey="ColorName"
                                items={this.props.allColors}
                                values={this.state.filter.Colors}
                                onChange={(keys, items) => this.change({ Colors: keys })}
                            />
                        </div>
                    </div>

                </div>

                {this.props.authContext.canManageAll && <div className="row" >
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
                                onChange={t => this.change({ Users: ArrayHelper.select(t, t2 => t2.Key) }, { users: t })}
                            />
                        </div>
                    </div>
                </div>
                }

                <div className="row" >
                    {/* BikeRentId */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Rent#</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-qrcode"></i></span>
                            <input type="text" className="form-control" value={StringHelper.notNullOrEmpty(this.state.filter.BikeRentId, "")} disabled={this.props.isReadOnly}
                                onChange={e => this.change({ BikeRentId: e.target.value })} />
                        </div>
                    </div>

                    {/* BikeId */}
                    <div className="form-group col-sm-6" >
                        <label className="col-sm-2 control-label text-nowrap ">Bike#</label>
                        <div className="col-sm-4 input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-barcode"></i></span>
                            <NumericInput className="form-control" value={this.state.filter.BikeId} min={0} max={999999999} disabled={this.props.isReadOnly} snap
                                onChange={(value: number) => this.change({ BikeId: value })} />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="row">
                    <div className="col-sm-12 text-left">
                        <Button bsStyle="success" onClick={e => this.search(false)}><i className="glyphicon glyphicon-play-circle"></i> Refresh</Button>
                        &nbsp;&nbsp;
                    <Button bsStyle="danger" onClick={e => this.search(true)} ><i className="glyphicon glyphicon-asterisk"></i> Reset</Button>
                    </div>
                </div>
            </div>
        </div>;
    }
}