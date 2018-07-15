import * as React from 'react';
import { TypeHelper } from "./typeHelper";
import { StringHelper } from "./stringHelper";

/// <summary>
/// Helper functions for rendering
/// </summary>
export class RenderHelper {

    /// <summary>
    /// Renders clickable, sortable headers. If fieldname is not specified, renders normal header.
    /// </summary>
    public static renderSortableHeader(title: string, fieldName: string, orderBy: string[], orderByDescending: boolean, onClick: (fieldName: string) => void): JSX.Element {
        if (StringHelper.isNullOrEmpty(fieldName))
            return <td>{title}</td>;
        else
            return <td key={StringHelper.notNullOrEmpty(fieldName, title)} className="pointer" onClick={e => onClick(fieldName)} >
                {title}
                {StringHelper.arrayContains(orderBy, fieldName, true) && <span>&nbsp;<i className={"glyphicon glyphicon-triangle-" + (orderByDescending ? "bottom" : "top")} ></i></span>}
            </td>;
    }

    /// <summary>
    /// Renders clickable, sortable headers. If fieldname is not specified, renders normal header.
    /// </summary>
    public static renderSortableHeaders(headers: { title: string, fieldName: string }[], orderBy: string[], orderByDescending: boolean, onClick: (fieldName: string) => void): JSX.Element[] {
        var length = headers.length;
        var res = new Array(length);

        for (var i = 0; i < length; i++) {
            var header = headers[i];
            res[i] = RenderHelper.renderSortableHeader(header.title, header.fieldName, orderBy, orderByDescending, onClick);
        }

        return res;
    }
}