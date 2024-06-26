import type { Range } from "@unimatch/parser";
import { seq } from "stdseq";

export function consolidate<T extends { range: Range; name: string; value?: any }>(rows: T[]) {
    const result = new Map<string, Omit<T, "range"> & { ranges: Range[] }>();
    for (const row of rows) {
        const range = row.range;
        const key = "value" in row ? `${row.name}=${row.value}` : row.name;
        delete (row as any).range;
        const consolidated = result.get(key) ?? { ...row, ranges: [] };
        consolidated.ranges.push(range);
    }
    return seq(result.values());
}
