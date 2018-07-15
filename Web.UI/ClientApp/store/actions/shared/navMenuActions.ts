import { StoreAction, IStoreAction } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { NavMenuAuthContext } from '../../../components/NavMenu';
import { AppUser } from '../../../models/security/appUser';
import { Permission } from '../../../models/security/permission';
import { AuthServiceActions } from '../../actions/security/authServiceActions';
import { RootState } from '../../state/rootState';

export class NavMenuActions {

    public static authorize(onSuccess: (authContext: NavMenuAuthContext) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(false, null, false, false, 
                user => {
                    onSuccess({
                        currentUser: user,
                        allowBikes: AppUser.hasPermission(user, Permission.Bike_ViewAll),
                        allowRents: AppUser.hasPermission(user, [Permission.BikeRents_ViewAll, Permission.BikeRents_ManageOwn]),
                        allowUsers: AppUser.hasPermission(user, Permission.User_Management),
                        allowMaps: AppUser.hasPermission(user, Permission.Bike_ViewAll)
                    });
                }));
        };
    }
}