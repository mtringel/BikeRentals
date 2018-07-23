import { ColorsState } from './master/colorsState';
import { BikeModelsState } from './bikes/bikeModelsState';
import { UsersState } from './users/usersState';
import { ClientContextState } from './shared/clientContextState';
import { FormValidatorState } from './shared/formValidatorState';
import { AuthServiceState } from './security/authServiceState';
import { WebApiServiceState } from './shared/webApiServiceState';
import { LoginParamsState } from './account/loginParamsState';
import { BikesState } from './bikes/bikesState';
import { BikeRentsState } from './rents/bikeRentsState';
import { AutoCompleteState } from './shared/autoCompleteState';

export class RootState {

    public readonly clientContext = new ClientContextState();

    public readonly authService = new AuthServiceState();

    public readonly colors = new ColorsState();

    public readonly bikeModels = new BikeModelsState();

    public readonly users = new UsersState();

    public readonly formValidator = new FormValidatorState();

    public readonly webApiService = new WebApiServiceState();

    public readonly loginParams = new LoginParamsState();

    public readonly bikes = new BikesState();

    public readonly bikeRents = new BikeRentsState();

    public readonly autoComplete = new AutoCompleteState();
}