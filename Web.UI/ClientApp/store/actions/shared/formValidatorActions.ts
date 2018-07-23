import { FormValidatorError } from "../../../helpers/formValidationError";
import { StoreAction, IStoreAction, StoreActionThunk } from "../../actions/storeAction";
import { StoreActionType } from "../../actions/storeActionType";
import { StringHelper } from "../../../helpers/stringHelper";
import { FormValidationType } from "../../../helpers/formValidationType";
import { ResourceType } from "../../../models/shared/resourceType";
import { ArrayHelper } from "../../../helpers/arrayHelper";
import { RootState } from "../../state/rootState";
import { ClientContextActions } from "../../actions/shared/clientContextActions";

export class FormValidatorActionsPayload {
    public readonly errors: FormValidatorError[];
}

export class FormValidatorActions {

    private static validateInput(input: HTMLInputElement, requiredErrors: HTMLInputElement[]) {
        var value = input.value;

        if (input.required && StringHelper.isNullOrEmpty(input.value))
            requiredErrors.push(input);
    }

    public static validateForm(
        parentElement: HTMLElement,
        onSuccess: (isValid: boolean, errors: FormValidatorError[]) => void
    ): StoreActionThunk {
        
        return (dispatch, getState)  => {
            var context = getState().clientContext;
            var requiredErrors: HTMLInputElement[] = [];

            var process: Element[] = [];
            process.push(parentElement);

            while (process.length > 0) {
                var element = process.pop();

                // validate
                if (element instanceof HTMLInputElement)
                    FormValidatorActions.validateInput(element as HTMLInputElement, requiredErrors);

                // process children
                var children = element.children;
                var length = children.length;

                for (var i = 0; i < length; i++)
                    process.push(children[i]);
            }

            var allErrors: FormValidatorError[] = [];

            if (requiredErrors.length > 0) {
                allErrors.push(
                    {
                        inputs: requiredErrors,
                        errorMessage: context.globals.resource(ResourceType.Validation_MandatoryFieldsAreMissing),
                        validationType: FormValidationType.Required
                    });
            }

            dispatch(FormValidatorActions.setErrors(allErrors));
            onSuccess(allErrors.length === 0, allErrors);
        };
    }

    public static validateInputs(
        inputs: HTMLInputElement[],
        onSuccess: (isValid: boolean, errors: FormValidatorError[]) => void
    ): StoreActionThunk {
        
        return (dispatch, getState) => {
            var context = getState().clientContext;
            var requiredErrors: HTMLInputElement[] = [];

            // validate
            var length = inputs.length;

            for (var i = 0; i < length; i++)
                FormValidatorActions.validateInput(inputs[i], requiredErrors);

            var allErrors: FormValidatorError[] = [];

            if (requiredErrors.length > 0) {
                allErrors.push(
                    {
                        inputs: requiredErrors,
                        errorMessage: context.globals.resource(ResourceType.Validation_MandatoryFieldsAreMissing),
                        validationType: FormValidationType.Required
                    });
            }

            dispatch(FormValidatorActions.setErrors(allErrors));
            onSuccess(allErrors.length === 0, allErrors);
        };
    }

    /// <summary>
    /// Shows validation errors from validationErrors. 
    /// Usually called after validateForm() was called and returned false.
    /// </summary>
    public static showValidationErrors(
        errors?: FormValidatorError[] | undefined | null
    ): StoreActionThunk {
        
        return (dispatch, getState) => {

            if (!ArrayHelper.isNullOrEmpty(errors))
                dispatch(FormValidatorActions.setErrors(errors));
            else
                errors = getState().formValidator.errors;

            if (!ArrayHelper.isNullOrEmpty(errors))
                dispatch(ClientContextActions.showError(
                    StringHelper.join(errors, '\r\n', t => t.errorMessage)
                ));
        };
    }

    private static setErrors(errors: FormValidatorError[]): StoreAction<FormValidatorActionsPayload> {
        return {
            type: StoreActionType.FormValidator_SetErrors,
            payload: {
                errors: errors
            }
        };
    }
}