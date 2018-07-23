import { AppUser } from '../security/appUser';

export class BikeRentAuthContext {

    public readonly currentUser: AppUser;

    public readonly currentUserId: string;

    public readonly canManageOwn: boolean;

    public readonly canManageAll: boolean;
}