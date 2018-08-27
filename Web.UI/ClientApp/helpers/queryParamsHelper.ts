import { ArrayHelper } from "./arrayHelper";
import { KeyValuePair } from "../models/shared/keyValuePair";
import { StringHelper } from "./stringHelper";
import { TypeHelper } from "./typeHelper";

/// <summary>
/// Helper methods for query string parameters
/// </summary>
export class QueryParamsHelper {

    /// <summary>
    /// Returns associative array with query unescaped string parameters or single query string value.
    /// Use querystringAll(url) if more values are needed.
    /// Use querystring(name, url) if only a single parameter is needed.
    /// url is optional parameter, default value is window.location.href.
    /// Returns '' if not exists or empty.
    /// </summary>
    public static parseBool(url: string, name: string): boolean {
        return StringHelper.parseBool(QueryParamsHelper.parse(url, name));
    }

    /// <summary>
    /// Returns associative array with query unescaped string parameters or single query string value.
    /// Use querystringAll(url) if more values are needed.
    /// Use querystring(name, url) if only a single parameter is needed.
    /// url is optional parameter, default value is window.location.href.
    /// Returns '' if not exists or empty.
    /// </summary>
    public static parse(url: string, name: string): string {

        // find single query parameter
        var res = "";
        var i = url.indexOf('?');

        if (i >= 0) {
            var params = url.substr(i + 1).split('&');

            for (var val of params) {
                var j = val.indexOf('=');

                if (j >= 0) {
                    if (decodeURI(val.substr(0, j)) === name) {
                        res = decodeURI(val.substr(j + 1));
                        break;
                    }
                } else {
                    if (decodeURI(val) === name)
                        break;
                }
            }
        }

        return res;
    }

    /// <summary>
    /// Returns associative array with query unescaped string parameters or single query string value.
    /// Use querystringAll(url) if more values are needed.
    /// Use querystring(name, url) if only a single parameter is needed.
    /// url is optional parameter, default value is window.location.href.
    /// Returns '' if not exists or empty.
    /// </summary>
    public static parseAll(url: string): { [key: string]: string } {

        // parse all query parameters, return associative array
        var res = {};
        var i = url.indexOf('?');

        if (i >= 0) {
            var params = url.substr(i + 1).split('&');

            params.forEach(val => {
                var j = val.indexOf('=');

                if (j >= 0)
                    res[decodeURI(val.substr(0, j))] = decodeURI(val.substr(j + 1));
                else
                    res[decodeURI(val)] = "";
            });
        }

        return res;
    }

     /// <summary>
    /// Returns well formatted and encoded query parameters string, starting with "?" and separated by "&".
    /// Ignores null or empty values.
    /// </summary>
    public static format(params: KeyValuePair<string, any>[]) {
        if (ArrayHelper.isNullOrEmpty(params))
            return "";
        else {
            var res = "";
            var first = true;

            params.forEach(param => {
                if (!StringHelper.isNullOrEmpty(param.Key) && !TypeHelper.isNullOrEmpty(param.Value)) {
                    if (first)
                        first = false;
                    else
                        res += "&";

                    res += encodeURI(param.Key) + "=" + encodeURI(param.Value.toString());
                }
            });

            return first ? "" : ("?" + res);
        }
    }
}