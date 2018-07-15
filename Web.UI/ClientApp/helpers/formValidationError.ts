import { FormValidationType } from "./formValidationType";

export class FormValidatorError {

    public readonly inputs: HTMLInputElement[];

    public readonly errorMessage: string;

    public readonly validationType: FormValidationType;
}