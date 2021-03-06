﻿import * as React from 'react';
import { FormEvent } from 'react';
import { RootState } from '../../store/state/rootState';
import { BikeListFilter } from '../../models/bikes/bikeListFilter';
import { PagingInfo } from '../../models/shared/pagingInfo';
import { BikeListData } from '../../models/bikes/bikeListData';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
import { Location } from '../../models/master/location';
import { ComponentBase } from '../../helpers/componentBase';
import Badge from 'react-bootstrap/lib/Badge';
import Image from 'react-bootstrap/lib/Image';
import { StringHelper } from '../../helpers/stringHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { RenderHelper } from '../../helpers/renderHelper';
import { Store } from '../../store/store';
import { BikeStateHelper, BikeState } from '../../models/bikes/bikeState';
import { BikeListItem } from '../../models/bikes/bikeListItem';
import Button from 'react-bootstrap/lib/Button';
import { Bike } from '../../models/bikes/bike';

export interface BikeListComponentProps  {
    readonly store: Store;
    readonly authContext: BikeAuthContext;
    readonly data: BikeListData;
    readonly orderBy: string[];
    readonly orderByDescending: boolean;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly isReadOnly: boolean;
}

class BikeListComponentState {
    readonly data: BikeListData;
    readonly orderBy: string[];
    readonly orderByDescending: boolean;
    readonly shortDateTimeFormat: string;
}

export interface BikeListComponentActions {
    readonly onOrderByChange: (orderBy: string[], orderByDescending: boolean) => void;
    readonly onViewRents: (bikeId: number, authContext: BikeAuthContext) => void;
    readonly onEdit: (bike: BikeListItem) => void;
}

type ThisProps = BikeListComponentProps & BikeListComponentActions;
type ThisState = BikeListComponentState;

export class BikeListComponent extends ComponentBase<ThisProps, ThisState>
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
        var rootState = props.store.getState();

        var initial: ThisState = {
            data: props.data,
            orderBy: props.orderBy,
            orderByDescending: props.orderByDescending,
            shortDateTimeFormat: rootState.clientContext.globals.ShortDateTimeFormat
        };

        // invoke asynchronous load after successful authorization
        this.setState(initial);
    }

    private orderByIcon(fieldName: string): JSX.Element | null {
        if (!StringHelper.arrayContains(this.state.orderBy, fieldName, true))
            return null;
        if (this.state.orderByDescending)
            return <i className="glyphicon glyphicon-triangle-bottom"></ i >;
        else
            return <i className="glyphicon glyphicon-triangle-top"></i>;
    }


    private onOrderByChange(fieldName: string) {
        var contains = StringHelper.arrayContains(this.state.orderBy, fieldName, true);

        this.props.onOrderByChange(
            !contains ? [fieldName] : !this.state.orderByDescending ? this.state.orderBy : this.props.defaultOrderBy,
            contains && (!this.state.orderByDescending || this.props.defaultOrderByDescending)
        );
    }

    private canEdit(bike: BikeListItem): boolean {
        return this.props.authContext.canManage;
    }

    private canViewRents(bike: BikeListItem): boolean {
        return this.props.authContext.canViewMyRents || this.props.authContext.canViewAllRents;
    }

    private canRent(bike: BikeListItem): boolean {
        return this.props.authContext.canRent;
    }

    private onEdit(bike: BikeListItem) {
        if (!this.props.isReadOnly)
            this.props.onEdit(bike);
    }

    private onViewRents(bike: BikeListItem) {
        if (!this.props.isReadOnly)
            this.props.onViewRents(bike.BikeId, this.props.authContext);
    }

    private onRent(bike: BikeListItem) {
        // TODO
    }

    public render(): JSX.Element | null | false {
        return <div className="table table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr key="Header">
                        {RenderHelper.renderSortableHeaders([
                            { title: "Rating", fieldName: "RateAverage" },
                            this.props.authContext.canManage ? { title: "Current status", fieldName: "BikeState" } : null,
                            { title: "Photo", fieldName: "" },
                            { title: "Model", fieldName: "BikeModel.BikeModelName" },
                            { title: "Color", fieldName: "Color.ColorName" },
                            { title: "Weight", fieldName: "BikeModel.WeightLbs" },
                            { title: "Location", fieldName: "CurrentLocationName" },
                            { title: "Distance", fieldName: "DistanceMiles" },
                            { title: "Available from", fieldName: "AvailableFrom" },
                            { title: "Bike#", fieldName: "BikeId" },
                            { title: "", fieldName: "" }
                        ],
                            this.state.orderBy,
                            this.state.orderByDescending,
                            fieldName => this.onOrderByChange(fieldName)
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.List.map(item =>
                        <tr key={item.BikeId} >
                            <td key="Rate"><Badge>{StringHelper.formatNumber(item.RateAverage, 0, 1)}</Badge></td>
                            {this.props.authContext.canManage &&
                                <td><span style={{ background: "#" + BikeStateHelper.allColors[item.BikeState] }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;{BikeStateHelper.allNames[item.BikeState]}</td>
                            }
                            <td key="Image"><Image src={"/Api/Content?contentType=BikeImageThumb&key=" + item.BikeId.toString() + "&seq=" + TypeHelper.toString(item.ImageSeq)} width="100" height="60" rounded /></td>
                            <td key="Model">{item.BikeModel.BikeModelName}</td>
                            <td key="Color"><span style={{ background: "#" + item.Color.ColorId }}>&nbsp;</span>&nbsp;{item.Color.ColorName}</td>
                            <td key="Weight" className="text-right">{StringHelper.formatNumber(item.BikeModel.WeightLbs, 0, 1, " lbs")}</td>
                            <td key="LocName">{item.CurrentLocationName}</td>
                            <td key="Distance">{item.DistanceMiles === null ? "" : item.DistanceMiles >= 0.2 ? StringHelper.formatNumber(item.DistanceMiles, 0, 1, " mi") : StringHelper.formatNumber(item.DistanceMiles * 5280, 0, 0, " ft")}</td>
                            <td key="AvailFrom">{StringHelper.formatDate(new Date(item.AvailableFromUtc), this.state.shortDateTimeFormat) + (item.BikeState === BikeState.Available ? " (now)" : " (forecasted)")}</td>
                            <td key="BikeId">#{item.BikeId}</td>
                            <td key="Actions">
                                {this.canRent(item) && <div style={{ marginBottom: "4px" }}><Button bsStyle="success" bsSize="small" onClick={e => this.onRent(item)} >
                                    <i className="glyphicon glyphicon-tag"></i> Rent
                                </Button></div>
                                }
                                {this.canViewRents(item) && <Button bsStyle="primary" bsSize="small" title="View rents" onClick={e => this.onViewRents(item)} ><i className="glyphicon glyphicon-tags"></i></Button>}
                                &nbsp;
                                {this.canEdit(item) && <Button bsStyle="primary" bsSize="small" title="Edit" onClick={e => this.onEdit(item)} ><i className="glyphicon glyphicon-edit"></i></Button>}                                
                            </td>
                        </tr>
                        , this)}
                </tbody>
            </table>
        </div>;
    }
}