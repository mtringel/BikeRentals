import * as React from 'react';
import { FormEvent } from 'react';
import { RootState } from '../../store/state/rootState';
import { BikeListFilter } from '../../models/bikes/bikeListFilter';
import { PagingInfo } from '../../models/shared/pagingInfo';
import { BikeListData } from '../../models/bikes/bikeListData';
import { BikeAuthContext } from '../../models/bikes/bikeAuthContext';
import { Location } from '../../models/master/location';
import { ComponentBase } from '../../helpers/componentBase';
import Badge from 'react-bootstrap/lib/Badge';
import { StringHelper } from '../../helpers/stringHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { RenderHelper } from '../../helpers/renderHelper';
import { Store } from '../../store/store';
import { BikeStateHelper } from '../../models/bikes/bikeState';

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

        // set empty state for render()
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


    private orderByChanged(fieldName: string) {
        var contains = StringHelper.arrayContains(this.state.orderBy, fieldName, true);

        this.props.onOrderByChange(
            !contains ? [fieldName] : !this.state.orderByDescending ? this.state.orderBy : this.props.defaultOrderBy,
            contains && (!this.state.orderByDescending || this.props.defaultOrderByDescending)
        );
    }

    public render(): JSX.Element | null | false {
        return <div className="table table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
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
                            fieldName => this.orderByChanged(fieldName)
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.List.map(item =>
                        <tr key={item.BikeId} >
                            <td><Badge>{StringHelper.formatNumber(item.RateAverage, 0, 1)}</Badge></td>
                            {this.props.authContext.canManage &&
                                <td><span style={{ background: "#" + BikeStateHelper.allColors[item.BikeState] }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;{BikeStateHelper.allNames[item.BikeState]}</td>
                            }
                            <td><img src={"/Api/Content?contentType=BikeImageThumb&Key=" + item.BikeId.toString()} width="100" height="60" /></td>
                            <td>{item.BikeModel.BikeModelName}</td>
                            <td><span style={{ background: "#" + item.Color.ColorId }}>&nbsp;</span>&nbsp;{item.Color.ColorName}</td>
                            <td className="text-right">{StringHelper.formatNumber(item.BikeModel.WeightLbs, 0, 1, "lbs")}</td>
                            <td>{item.CurrentLocationName}</td>
                            <td>{item.DistanceMiles === null ? "" : item.DistanceMiles >= 0.2 ? StringHelper.formatNumber(item.DistanceMiles, 0, 1, "mi") : StringHelper.formatNumber(item.DistanceMiles * 5280, 0, 0, "ft")}</td>
                            <td>{StringHelper.formatDate(new Date(item.AvailableFrom), this.state.shortDateTimeFormat) + (item.CurrentlyAvailable ? " (now)" : " (forecasted)")}</td>
                            <td>#{item.BikeId}</td>
                            <td>
                                {/*
                                            {this.userIsEditable(item) && <Button bsStyle="primary" bsSize="xsmall" onClick={e => this.edit(item)} >
                                                <i className="glyphicon glyphicon-edit"></i>
                                            </Button>
                                            }
                                            */}
                            </td>
                        </tr>
                        , this)}
                </tbody>
            </table>
        </div>;
    }
}