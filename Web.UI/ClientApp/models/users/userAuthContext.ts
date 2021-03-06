﻿import { AppUser } from '../security/appUser';

export class UserAuthContext {

    public readonly currentUser: AppUser;

    public readonly currentUserId: string;

    public readonly canManage: boolean;

    public readonly canEditAdmin: boolean;

    public readonly canSetRole: boolean;   
}