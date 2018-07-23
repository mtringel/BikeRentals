import * as React from 'react';
import { FormEvent } from 'react';
import { RootState } from '../../store/state/rootState';
import { PagingInfo } from '../../models/shared/pagingInfo';
import { Location } from '../../models/master/location';
import { ComponentBase } from '../../helpers/componentBase';
import Badge from 'react-bootstrap/lib/Badge';
import { StringHelper } from '../../helpers/stringHelper';
import { TypeHelper } from '../../helpers/typeHelper';
import { ArrayHelper } from '../../helpers/arrayHelper';
import { RenderHelper } from '../../helpers/renderHelper';
import { Store } from '../../store/store';
import { BikeRentAuthContext } from '../../models/rents/bikeRentAuthContext';
import { BikeRentListData } from '../../models/rents/bikeRentListData';
import { BikeRentStateHelper } from '../../models/rents/bikeRentState';

export interface BikeRentListComponentProps  {
    readonly store: Store;
    readonly authContext: BikeRentAuthContext;
    readonly data: BikeRentListData;
    readonly orderBy: string[];
    readonly orderByDescending: boolean;
    readonly defaultOrderBy: string[];
    readonly defaultOrderByDescending: boolean;
    readonly isReadOnly: boolean;
}

class BikeRentListComponentState {
    readonly data: BikeRentListData;
    readonly orderBy: string[];
    readonly orderByDescending: boolean;
    readonly shortDateTimeFormat: string;
}

export interface BikeRentListComponentActions {
    readonly onOrderByChange: (orderBy: string[], orderByDescending: boolean) => void;
}

type ThisProps = BikeRentListComponentProps & BikeRentListComponentActions;
type ThisState = BikeRentListComponentState;

export class BikeRentListComponent extends ComponentBase<ThisProps, ThisState>
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
                            { title: "Photo", fieldName: "" },
                            { title: "Status", fieldName: "BikeRentState" },
                            { title: "Model", fieldName: "BikeModel.BikeModelName" },
                            { title: "Color", fieldName: "Color.ColorName" },
                            { title: "User", fieldName: "tmp_UserFullName" }, // not existing field, see DataProvider for OrderBy implementation
                            { title: "Start date", fieldName: "StartDate" },
                            { title: "End date", fieldName: "EndDate" },
                            { title: "Pick up location", fieldName: "PickupLocationName" },
                            { title: "Return location", fieldName: "ReturnLocationName" },
                            { title: "Rent#", fieldName: "BikeRentId" },
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
                        <tr key={item.BikeRentId} >
                            <td><img src={"/Api/Content?contentType=BikeImageThumb&Key=" + item.Bike.BikeId.toString()} width="100" height="60" /></td>
                            <td>{BikeRentStateHelper.allNames[item.BikeRentState]}</td>
                            <td>{item.Bike.BikeModel.BikeModelName}</td>
                            <td><span style={{ background: "#" + item.Bike.Color.ColorId }}>&nbsp;</span>&nbsp;{item.Bike.Color.ColorName}</td>
                            <td>{item.User.LastName.toUpperCase()}, {item.User.FirstName}</td>
                            <td className="text-right">{StringHelper.formatDate(item.StartDate, this.state.shortDateTimeFormat)}</td>
                            <td className="text-right">{StringHelper.formatDate(item.EndDate, this.state.shortDateTimeFormat)}</td>
                            <td>{item.PickUpLocationName}</td>
                            <td>{item.ReturnLocationName}</td>
                            <td>#{item.BikeRentId}</td>
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
