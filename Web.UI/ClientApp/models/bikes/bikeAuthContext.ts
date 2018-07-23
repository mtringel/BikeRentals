import { AppUser } from '../security/appUser';

export class BikeAuthContext {

    public readonly currentUser: AppUser;

    public readonly currentUserId: string;

    public readonly canManage: boolean;
}