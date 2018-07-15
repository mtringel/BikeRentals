import { Filter } from "./filter";
import { ArrayHelper } from "../../helpers/arrayHelper";
import { TypeHelper } from "../../helpers/typeHelper";
import { StringHelper } from "../../helpers/stringHelper";

export class PagingInfo extends Filter {

    public readonly FirstRow: number | null = null;

    public readonly RowCount: number | null = null;

    /// <summary>
    /// '|' separated list of fieldnames
    /// </summary>
    public readonly OrderBy: string[] = [];

    public readonly OrderByDescending: boolean = false;

    /// <summary>
    /// Sets total row count into TotalRowCount, if specified
    /// </summary>
    public readonly ReturnTotalRowCount: boolean = false;

    public static CompareOrdering(pi1: PagingInfo, pi2: PagingInfo): boolean {
        return !TypeHelper.isNullOrEmpty(pi1) &&
            !TypeHelper.isNullOrEmpty(pi2) &&
            pi1.OrderByDescending === pi2.OrderByDescending &&
            ArrayHelper.compare(pi1.OrderBy, pi2.OrderBy, (t1, t2) => StringHelper.compare(t1, t2, true));
    }

    public static ComparePaging(pi1: PagingInfo, pi2: PagingInfo): boolean {
        return !TypeHelper.isNullOrEmpty(pi1) &&
            !TypeHelper.isNullOrEmpty(pi2) &&
            TypeHelper.notNullOrEmpty(pi1.FirstRow, 0) === TypeHelper.notNullOrEmpty(pi2.FirstRow, 0) &&
            TypeHelper.notNullOrEmpty(pi1.RowCount, TypeHelper.int.maxValue) === TypeHelper.notNullOrEmpty(pi2.RowCount, TypeHelper.int.maxValue)
    }

    public static ComparePagingAndOrdering(pi1: PagingInfo, pi2: PagingInfo): boolean {
        return PagingInfo.ComparePaging(pi1, pi2) && PagingInfo.CompareOrdering(pi1, pi2);
    }
}