import { KeyValuePair } from "../shared/keyValuePair";
import { RoleType } from "./roleType";

export class RoleListData {

    public readonly List: KeyValuePair<RoleType, string>[] = [];
}