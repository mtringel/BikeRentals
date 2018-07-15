import { RoleType } from '../../../models/security/roleType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class RolesState {

    public readonly roles: KeyValuePair<RoleType, string>[] = [];
}