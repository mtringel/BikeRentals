/// <summary>
/// Base class for screens
/// </summary>
export interface IScreen {
    currentPath(): string;
    redirect(url: string): void;
}