import * as Redux from 'redux';

// custom types
import { RootState } from '../state/rootState';
import { BikeModelsReducers } from './bikes/bikeModelsReducers';
import { ColorsReducers } from './master/colorsReducers';
import { UsersReducers } from './users/usersReducers';
import { ClientContextReducers } from './shared/clientContextReducers';
import { FormValidatorReducers } from './shared/formValidatorReducers';
import { AuthServiceReducers } from './security/authServiceReducers';
import { WebApiServiceReducers } from './shared/webApiServiceReducers';
import { LoginParamsReducers } from './account/loginParamsReducers';
import { BikesReducers } from './bikes/bikesReducers';
import { BikeRentsReducers } from './rents/bikeRentsReducers';
import { AutoCompleteReducers } from './shared/autoCompleteReducers';

export class RootReducerProvider {

    public static CombineReducers(): Redux.Reducer<RootState> {
        return Redux.combineReducers({
            clientContext: ClientContextReducers,
            authService: AuthServiceReducers,
            webApiService: WebApiServiceReducers,
            bikeModels: BikeModelsReducers,
            colors: ColorsReducers,
            users: UsersReducers,
            formValidator: FormValidatorReducers,
            loginParams: LoginParamsReducers,
            bikes: BikesReducers,
            bikeRents: BikeRentsReducers,
            autoComplete: AutoCompleteReducers
        });
    }
}
