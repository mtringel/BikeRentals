/// <summary>
/// Helper functions for working with numbers
/// </summary>
export class MathHelper {

    public static roundNumber(value: number, digits: number) {
        var pow = Math.pow(10, digits);
        return Math.round(value * pow) / pow;
    }

    public static clamp(value: number, min: number, max: number) {
        return value < min ? min : value > max ? max : value;
    }

}