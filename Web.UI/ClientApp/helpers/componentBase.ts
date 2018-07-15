import * as React from 'react';
import { IComponent } from './IComponent';

/// <summary>
/// Base class for components
/// </summary>
export class ComponentBase<Props, State> extends React.PureComponent<Props, State> implements IComponent {

}