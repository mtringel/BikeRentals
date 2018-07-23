import * as React from 'react';
import { ArrayHelper } from '../../helpers/arrayHelper';

export enum BikeRentState {
    Reserved,
    Returned,
    Lost
}

export class BikeRentStateHelper {
    public static readonly allStates: BikeRentState[] = [BikeRentState.Reserved, BikeRentState.Returned, BikeRentState.Lost];

    public static readonly allNames: string[] = ["Reserved", "Returned", "Lost"];

    public static getOption(state: BikeRentState): JSX.Element {
        return <option key={state} value={state}>{BikeRentStateHelper.allNames[state]}</option>
    }
}