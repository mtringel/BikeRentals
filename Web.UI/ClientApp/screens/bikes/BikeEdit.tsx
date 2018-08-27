import * as React from 'react';
import { ErrorIndicatorComponent } from '../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../components/shared/loaderIndicatorComponent';
import { StringHelper } from '../../helpers/stringHelper';
import Button from 'react-bootstrap/lib/Button';
import Popover from 'react-bootstrap/lib/Popover';
import Overlay from 'react-bootstrap/lib/Overlay';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import { Store } from '../../store/store';
import { ScreenBase, PropsBase } from '../../helpers/screenBase';
import { TypeHelper } from '../../helpers/typeHelper';
import { FormValidatorActions } from '../../store/actions/shared/formValidatorActions';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
import { BikeFormData } from '../../models/bikes/bikeFormData';
import { Bike } from '../../models/bikes/bike';
import { BikeFormComponent } from '../../components/bikes/BikeFormComponent';
import { Color } from '../../models/master/color';
import { BikeModel } from '../../models/bikes/bikeModel';

export interface BikeEditProps extends PropsBase {
    readonly store: Store;
}

export interface BikeEditActions {
    readonly onInit: (bikeId: number, isNewBike: boolean, onSuccess: (options: {
        authContext: BikeAuthContext,
        initialLoadCached: boolean,
        colors: Color[],
        bikeModels: BikeModel[]
    }) => void) => void;

    readonly onLoad: (allowCachedData: boolean, bikeId: number, isNewBike: boolean, onSuccess: (data: BikeFormData) => void) => void;
    readonly onCancel: (bike: Bike, isNewBike: boolean) => void;
    readonly onSave: (bike: Bike, isNewBike: boolean) => void;
    readonly onDelete: (bike: Bike, isNewBike: boolean) => void;
}

class BikeEditState {
    readonly data = new BikeFormData();
    readonly bikeId: number; // id == bikeId or 0 for new
    readonly isNewBike: boolean;
    readonly isDirty: boolean;
    readonly authContext = new BikeAuthContext();
    readonly isInitialized: boolean;
    readonly colors: Color[] = [];
    readonly bikeModels: BikeModel[] = [];
    readonly showDeleteConfirmation: boolean;
}

type ThisProps = BikeEditProps & BikeEditActions;
type ThisState = BikeEditState;

export class BikeEdit extends ScreenBase<ThisProps, ThisState>
{
    private form: HTMLFormElement;
    private deleteConfirmationOverload: Popover;

    public componentWillMount() {
        if (super.componentWillMount) super.componentWillMount();

        var bikeId = StringHelper.parseNumber((this.props as any).match.params.bikeId, 0);
        var isNew = (bikeId <= 0);

        // set empty state so the form renderes for the user promptly without data
        this.setState(new BikeEditState(), () => {
            this.props.onInit(bikeId, isNew, options => {

                // invoke asynchronous load after successful authorization        
                this.setState({
                    data: new BikeFormData(),
                    bikeId: bikeId,
                    isNewBike: isNew,
                    isDirty: false,
                    authContext: options.authContext,
                    isInitialized: false,
                    colors: options.colors,
                    bikeModels: options.bikeModels,
                    showDeleteConfirmation: false
                },
                    () => {
                        if (options.authContext.canManage)
                            this.loadData(options.initialLoadCached)
                    }
                );
            });
        });
    }

    private loadData(allowCachedData: boolean) {
        this.props.onLoad(
            allowCachedData,
            this.state.bikeId,
            this.state.isNewBike,
            data => this.setState({ data: data, isInitialized: true })
        );
    }

    private onCancel() {
        this.props.onCancel(this.state.data.Bike, this.state.isNewBike);
    }

    private onSubmit() {
        if (this.state.isInitialized) {
            this.props.store.dispatch(FormValidatorActions.validateForm(
                this.form,
                (isValid, errors) => {
                    if (isValid)
                        this.props.onSave(this.state.data.Bike, this.state.isNewBike);
                    else
                        this.props.store.dispatch(FormValidatorActions.showValidationErrors());
                }
            ));
        }
    }

    private onConfirmDelete() {
        if (this.state.isInitialized && !this.state.isNewBike)
            this.setState({ showDeleteConfirmation: true });
    }

    private onDelete() {
        if (this.state.isInitialized && !this.state.isNewBike)
            this.props.onDelete(this.state.data.Bike, this.state.isNewBike);
    }

    private change(changed: Partial<Bike>) {
        this.setState({ data: { ...this.state.data, Bike: { ...this.state.data.Bike, ...changed } }, isDirty: true });
    }

    private deleteConfirmationPopup(): JSX.Element {
        return <Popover
            id="deleteConfirmation"
            title="Delete Bike"            
        >
            <div>Are you sure?</div>
            <div>&nbsp;</div>
            <div>
                <Button bsStyle="danger" disabled={!this.state.isInitialized} onClick={e => this.onDelete()} >
                    <i className="glyphicon glyphicon-share-alt"></i> Ok
                </Button>
                &nbsp;
                &nbsp;
                <Button bsStyle="success" disabled={!this.state.isInitialized} onClick={e => this.deleteConfirmationOverload.hide()} >
                    <i className="glyphicon glyphicon-ban-circle"></i> Cancel
                </Button>
            </div>
        </Popover>
    }

    public render(): JSX.Element | null | false {
        return <div>
            <h2>{this.state.isNewBike ? "New bike" : "Modify bike"}</h2>
            <h3></h3>
            <ErrorIndicatorComponent store={this.props.store} />
            <LoaderIndicatorComponent store={this.props.store} />

            <div id="panelPrimary" className="panel panel-primary">

                <div className="panel-heading">Bike Form</div>
                <div className="panel-body">

                    <form className="form-horizontal" role="form" id="form" name="form" ref={t => this.form = t} onSubmit={e => { e.preventDefault(); this.onSubmit(); }}>

                        <BikeFormComponent
                            store={this.props.store}
                            bike={this.state.data.Bike}
                            authContext={this.state.authContext}
                            isReadOnly={!this.state.isInitialized}
                            isInitialized={this.state.isInitialized}
                            bikeModels={this.state.bikeModels}
                            colors={this.state.colors}
                            addNew={this.state.isNewBike}
                            onChange={(changed, data) => this.change(changed)}
                        />

                        {/* Buttons */}
                        <div className="form-group row">
                            <div className="col-md-9 col-md-offset-3">

                                {/* Cancel */}
                                <span>
                                    &nbsp;
                                    <Button bsStyle="warning" onClick={e => this.onCancel()}>
                                        <i className="glyphicon glyphicon-thumbs-down"></i> Cancel
                                    </Button>
                                    &nbsp;
                                </span>

                                {/* Save */}
                                <span>
                                    &nbsp;
                                    <Button bsStyle="primary" type="submit" disabled={!this.state.isInitialized || !this.state.isDirty} >
                                        <i className="glyphicon glyphicon-thumbs-up"></i> Save
                                    </Button>
                                    &nbsp;
                                </span>

                                {/* Delete */}
                                {!this.state.isNewBike && <span>
                                    &nbsp;
                                    <OverlayTrigger trigger="click" overlay={this.deleteConfirmationPopup()} ref={t => this.deleteConfirmationOverload = t}>
                                        <Button bsStyle="danger" disabled={!this.state.isInitialized}>
                                            <i className="glyphicon glyphicon-trash"></i> Delete
                                        </Button>
                                    </OverlayTrigger>
                                    &nbsp;
                                    </span>
                                }

                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </div>;
    }
}