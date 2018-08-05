import { StoreDispatch } from "./storeAction";
import { UsersActions } from "./users/usersActions";
import { BikeModelsActions } from "./bikes/bikeModelsActions";
import { ColorsActions } from "./master/colorsActions";
import { AutoCompleteActions } from "./shared/autoCompleteActions";
import { BikesActions } from "./bikes/bikesActions";
import { BikeRentsActions } from "./rents/bikeRentsActions";

export class StoreActions {
    /// <summary>
    /// Invalidates all cached data which is too old according to its timestamp and AppConfig.WebApplication.ClientCachingDurationInMinutes.
    /// </summary>
    public static clearStateIfExpiredAll(dispatch: StoreDispatch) {
        dispatch(UsersActions.clearStateIfExpired());
        dispatch(BikeModelsActions.clearStateIfExpired());
        dispatch(ColorsActions.clearStateIfExpired());
        dispatch(AutoCompleteActions.clearStateIfExpired());
        dispatch(BikesActions.clearStateIfExpired());
        dispatch(BikeRentsActions.clearStateIfExpired());
    }

    /// <summary>
    /// Invalidates all cached data.
    /// </summary>
    public clearStateAll(dispatch: StoreDispatch) {
        dispatch(UsersActions.clearState());
        dispatch(BikeModelsActions.clearState());
        dispatch(ColorsActions.clearState());
        dispatch(AutoCompleteActions.clearState());
        dispatch(BikesActions.clearState());
        dispatch(BikeRentsActions.clearState());
    }
}