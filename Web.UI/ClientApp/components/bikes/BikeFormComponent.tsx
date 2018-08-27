import * as React from 'react';
import { connect } from 'react-redux';
import { FormEvent } from 'react';
import { User } from '../../models/users/user';
import { RoleType, RoleTypeHelper } from '../../models/security/roleType';
import { KeyValuePair } from '../../models/shared/keyValuePair';
import { RootState } from '../../store/state/rootState';
import { ComponentBase } from '../../helpers/componentBase';
import { MathHelper } from '../../helpers/mathHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { Bike } from '../../models/bikes/bike';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
import Select from 'react-select';
import Button from 'react-bootstrap/lib/Button';
import Image from 'react-bootstrap/lib/Image';
import NumericInput from 'react-numeric-input';
import { DateHelper } from '../../helpers/dateHelper';
import { BikeModel } from '../../models/bikes/bikeModel';
import { StringHelper } from '../../helpers/stringHelper';
import { Color } from '../../models/master/color';
import { BikeStateHelper, BikeState } from '../../models/bikes/bikeState';
import { SelectComponent } from '../../components/shared/SelectComponent';
import { LocationComponent } from '../shared/LocationComponent';
import { Store } from '../../store/store';
import { ClientContextActions } from '../../store/actions/shared/clientContextActions';

export interface BikeFormComponentProps  {
    readonly store: Store;
    readonly bike: Bike;
    readonly bikeModels: BikeModel[];
    readonly colors: Color[];
    readonly authContext: BikeAuthContext;
    readonly isReadOnly: boolean;
    readonly isInitialized: boolean;
    readonly addNew: boolean; // selects should contain empty value ("Please, select...")
}

class BikeFormComponentState {
    readonly bike: Bike;
    readonly isDirty: boolean;
}

export interface BikeFormComponentActions {
    readonly onChange: (changed: Partial<Bike>, bike: Bike) => void;
}

class BikeStateSelect extends SelectComponent<BikeState>{ }
class BikeModelSelect extends SelectComponent<BikeModel>{ }
class ColorSelect extends SelectComponent<Color>{ }

/// <summary>
/// Components DO NOT implement IScreen
/// </summary>
export class BikeFormComponent extends ComponentBase<BikeFormComponentProps & BikeFormComponentActions, BikeFormComponentState> {

    public componentWillReceiveProps(nextProps: Readonly<BikeFormComponentProps & BikeFormComponentActions>, nextContent: any) {
        if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps, nextContent);

        if (!TypeHelper.shallowEquals(nextProps, this.props))
            this.initialize(nextProps);
    }

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        this.initialize(this.props);
    }

    private initialize(props: Readonly<BikeFormComponentProps & BikeFormComponentActions>) {
        // set state for render()
        var initial = {
            bike: props.bike,
            isDirty: false
        };

        this.setState(initial);
    }

    private change(changed: Partial<Bike>) {
        this.setState(
            {
                bike: { ...this.state.bike, ...changed },
                isDirty: true
            },
            () => this.props.onChange(changed, this.state.bike)
        );
    }

    private changeFile(input: HTMLInputElement) {
        if (input.files.length > 0) {
            var reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = evt => {
                this.change({
                    ImageToUploadContentBase64: (evt.target as any).result,
                    ImageToUploadFileName: input.value
                });
            }
            reader.onerror = error => {
                this.props.store.dispatch(ClientContextActions.showError(error.toString()));
            }
        }
    }

    public render(): JSX.Element | null | false {
        return <div>
            {this.props.isInitialized && <div>
                {/* State */}
                <div className="form-group">
                    <label htmlFor="state" className="col-sm-3 control-label">Current state</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-flash"></i></span>
                        <BikeStateSelect id="state" name="state" className="form-control" required={true} isReadOnly={this.props.isReadOnly} value={this.state.bike.BikeState}
                            placeholder="Please fill mandatory field"
                            getItem={t => BikeStateHelper.allStates[parseInt(t.value)]}
                            getOption={t => { return { value: TypeHelper.toString(t), text: BikeStateHelper.allNames[t] }; }}
                            items={BikeStateHelper.allStates}
                            emptyOption={this.props.addNew ? "Please, select..." : ""}
                            onChange={t => this.change({ BikeState: t })}
                        />
                    </div>
                </div>

                {/* Model */}
                <div className="form-group">
                    <label htmlFor="model" className="col-sm-3 control-label">Model</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-cog"></i></span>
                        <BikeModelSelect id="model" name="model" className="form-control" required={true} isReadOnly={this.props.isReadOnly} value={this.state.bike.BikeModel}
                            placeholder="Please fill mandatory field"
                            getItem={t => { return { ...new BikeModel(), BikeModelId: StringHelper.parseNumber(t.value), BikeModelName: t.text }; }}
                            getOption={t => { return { value: TypeHelper.toString(t.BikeModelId), text: t.BikeModelName + " (" + StringHelper.formatNumber(t.WeightLbs, 0, 1, " lbs") + ")" }; }}
                            items={this.props.bikeModels}
                            emptyOption={this.props.addNew ? "Please, select..." : ""}
                            onChange={t => this.change({ BikeModel: t })}
                        />
                    </div>
                </div>

                {/* Color */}
                <div className="form-group">
                    <label htmlFor="color" className="col-sm-3 control-label">Color</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-tint"></i></span>
                        <ColorSelect id="color" name="color" className="form-control" required={true} isReadOnly={this.props.isReadOnly} value={this.state.bike.Color}
                            placeholder="Please fill mandatory field"
                            getItem={t => { return { ...new Color(), ColorId: t.value, ColorName: t.text }; }}
                            getOption={t => { return { value: t.ColorId, text: t.ColorName }; }}
                            items={this.props.colors}
                            emptyOption={this.props.addNew ? "Please, select..." : ""}
                            onChange={t => this.change({ Color: t })}
                        />
                    </div>
                </div>

                {/* CurrentLocation_Name */}
                <div className="form-group" >
                    <label htmlFor="locationName" className="col-sm-3 control-label">Location name</label>
                    <div className="col-sm-6 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-map-marker"></i></span>
                        <input type="text" id="locationName" name="locationName" className="form-control" value={StringHelper.notNullOrEmpty(this.state.bike.CurrentLocationName, "")} maxLength={100} disabled={this.props.isReadOnly}
                            required={true}
                            placeholder="Please fill mandatory field"
                            onChange={e => this.change({ CurrentLocationName: e.target.value })}
                        />
                    </div>
                </div>

                {/* CurrentLocationLat/Lng */}
                <div className="form-group">
                    <label className="col-sm-3 control-label">Current location</label>
                    <div className="col-sm-9 input-group">
                        <LocationComponent
                            isReadOnly={this.props.isReadOnly}
                            required={true}
                            value={this.state.bike.CurrentLocation}
                            onChange={loc => this.change({ CurrentLocation: loc })}
                        />
                    </div>
                </div>

                {/* Distance (read-only) */}
                <div className="form-group">
                    <label className="col-sm-3 control-label">Distance</label>
                    <div className="col-sm-3 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-record"></i></span>
                        <NumericInput className="form-control text-right" precision={1} value={this.state.bike.DistanceMiles} readOnly={true} snap
                            format={t => t + " mi"}
                        />
                    </div>
                </div>

                {/* Image */}
                {!this.props.addNew &&
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Image</label>
                        <div className="col-sm-3 input-group">
                            <Image src={"/Api/Content?contentType=BikeImage&key=" + this.props.bike.BikeId.toString() + "&seq=" + TypeHelper.toString(this.props.bike.ImageSeq)} rounded />
                        </div>
                    </div>
                }

                {/* Upload Image */}
                <div className="form-group">
                    <label className="col-sm-3 control-label">Upload image</label>
                    <div className="col-sm-3 input-group">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-camera"></i></span>
                        <input type="file" className="form-control" onChange={e => this.changeFile(e.target)} />
                    </div>
                </div>
            </div>
            }
        </div>;
    }
}