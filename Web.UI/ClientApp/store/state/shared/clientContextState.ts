import { GlobalParameters } from '../../../models/shared/globalParameters';
import { NavMenu } from '../../../components/NavMenu';
import { IScreen } from '../../../helpers/IScreen';
import { ErrorIndicatorComponent } from '../../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../../components/shared/loaderIndicatorComponent';
import { Location } from '../../../models/master/location';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class ClientContextState {

    public readonly navMenu: NavMenu | null = null;

    public readonly errorIndicators: ErrorIndicatorComponent[] = [];

    public readonly loaderIndicators: LoaderIndicatorComponent[] = [];

    public readonly globals: GlobalParameters | null = null;

    public readonly activeScreen: IScreen | null = null;

    public readonly lastScreen: IScreen | null = null;

    public readonly currentLocation: Location | null = null;
}
