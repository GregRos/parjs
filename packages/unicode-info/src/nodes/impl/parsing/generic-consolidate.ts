import type { Range } from "@unicode-info/parser";
import { seq } from "stdseq";

export function consolidate<T extends { range: Range; name: string; value?: any }>(rows: T[]) {
    const result = new Map<string, Omit<T, "range"> & { ranges: Range[] }>();
    for (const row of rows) {
        const range = row.range;
        const key = "value" in row ? `${row.name}=${row.value}` : row.name;
        delete (row as any).range;
        let myResult = result.get(key);
        if (!myResult) {
            myResult = { ...row, ranges: [] };
            result.set(key, myResult);
        }
        myResult.ranges.push(range);
    }
    const vals = Array.from(result.values());
    return seq(vals);
}
