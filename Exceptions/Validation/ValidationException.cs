using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Toptal.BikeRentals.Exceptions.Validation
{
    /// <summary>
    /// Root class for all validation exceptions
    /// </summary>
    public class ValidationException : AppException
    {
        public ValidationException()
            : this(string.Empty, false)
        {
        }

        public ValidationException(string validationMessage, bool addPleaseCorrectTheFollowingErrorsPrefix)
            : base(
                  HttpStatusCode.BadRequest, 
                  FormatMessage(validationMessage, addPleaseCorrectTheFollowingErrorsPrefix), 
                  Microsoft.Extensions.Logging.LogLevel.None
                  )
        {
        }

        public ValidationException(IEnumerable<string> validationMesssages, bool addPleaseCorrectTheFollowingErrorsPrefix)
             : this(FormatMessage(validationMesssages, addPleaseCorrectTheFollowingErrorsPrefix), false)
        {
        }

        /// <summary>
        /// For basicHtmlFormatting, please refer to AlertIndicatorComponent/script.js/showAlert() (bold, italic, lists)
        /// </summary>
        public ValidationException(ModelStateDictionary modelState, bool addPleaseCorrectTheFollowingErrorsPrefix, bool basicHtmlFormatting)
             : this(FormatMessage(modelState, addPleaseCorrectTheFollowingErrorsPrefix, basicHtmlFormatting), false)
        {
        }

        #region FormatMessage

        public static string FormatMessage(string validationMessage, bool addPleaseCorrectTheFollowingErrorsPrefix)
        {
            return addPleaseCorrectTheFollowingErrorsPrefix ? 
                string.Format(Resources.Resources.Validation_Error, validationMessage) : 
                validationMessage;
        }

        public static string FormatMessage(IEnumerable<string> validationMesssages, bool addPleaseCorrectTheFollowingErrorsPrefix)
        {
            return FormatMessage(string.Join(" ", validationMesssages), addPleaseCorrectTheFollowingErrorsPrefix);
        }

        /// <summary>
        /// Concatenates errors by Environment.NewLine
        /// For basicHtmlFormatting, please refer to AlertIndicatorComponent/script.js/showAlert() (bold, italic, lists)
        /// </summary>
        public static string FormatMessage(ModelStateDictionary modelState, bool addPleaseCorrectTheFollowingErrorsPrefix, bool basicHtmlFormatting)
        {
            if (!modelState.IsValid)
            {
                // is there something to list at all?
                var message = 
                    basicHtmlFormatting && (addPleaseCorrectTheFollowingErrorsPrefix || modelState.ErrorCount > 1) ? 
                    $"<ul>{String.Join(string.Empty, modelState.SelectMany(t => t.Value.Errors).Select(t => $"<li>{t.ErrorMessage}</li>"))}</ul>" :
                    String.Join(Environment.NewLine, modelState.SelectMany(t => t.Value.Errors).Select(t => t.ErrorMessage));

                return addPleaseCorrectTheFollowingErrorsPrefix ? string.Format(Resources.Resources.Validation_Error, message) : message;
            }
            else
                return string.Empty;
        }

        #endregion
    }
}

