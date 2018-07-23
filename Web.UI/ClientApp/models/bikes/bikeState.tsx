import * as React from 'react';
import { ArrayHelper } from '../../helpers/arrayHelper';

export enum BikeState {
    Available,
    Reserved,
    Lost,
    Maintenance
}

export class BikeStateHelper {
    public static readonly allStates: BikeState[] = [BikeState.Available, BikeState.Reserved, BikeState.Lost, BikeState.Maintenance];

    public static readonly allNames: string[] = ["Available", "Reserved", "Lost", "Maintenance"];

    public static readonly allColors: string[] = ["80ff80", "ff8080", "808080", "ff80ff"];

    public static getOption(state: BikeState): JSX.Element {
        return <option key={state} value={state}>{BikeStateHelper.allNames[state]}</option>
    }
}