import { User } from '../../../models/users/user';
import { StringHelper } from '../../../helpers/stringHelper';
import { ReduxListDataCache, ReduxListDataCacheProps } from '../../../helpers/reduxListDataCache';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { UserListData } from '../../../models/users/userListData';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class UsersState {

    public readonly listFilter: string | undefined = undefined;

    public readonly timestamp: Date | null = null;

    public readonly cache = new ReduxListDataCache<UserListData, User, string, string>(
        new ReduxListDataCacheProps<UserListData, User, string, string>(
            // getId
            t => t.UserId,
            // getItems
            t => t.List,
            // setItems (User and UserListData are immutable)
            (data, items) => { return { List: items, TooMuchData: data.TooMuchData } },
            // getMatch
            (item, filter) => {
                return StringHelper.contains(item.Email, filter, true) ||
                    StringHelper.contains(item.FirstName + " " + item.LastName, filter, true) ||
                    StringHelper.contains(item.RoleTitle, filter, true) ||
                    StringHelper.contains(item.UserName, filter, true);
            },
            // isSubSet
            (parentFilter, parentData, subFilter) => !parentData.TooMuchData && StringHelper.contains(subFilter, parentFilter, true),
            // getSubSet
            (parentFilter, parentData, subFilter, getMatch) => parentData.TooMuchData ? null :
                {
                    List: parentData.List.filter(t => getMatch(t, subFilter)),
                    TooMuchData: false
                }
        ));
}