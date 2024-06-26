import type { UniPropValue } from "@unimatch/parser";

export function uniProps<Props extends Record<keyof Props, UniPropValue<any>>>(props: {
    [K in keyof Props]: Props[K][];
}): UniProps<Props> {
    const newUni = new Uni();
    const methods = {} as Record<string, any>;
    for (const key of Object.keys(props) as (keyof Props)[]) {
        const map = new Map(props[key].map((x: any) => [x.value, x]));
        const functionName = key as string;
        if (key in newUni) {
            throw new Error(`Function already exists: ${functionName}`);
        }
        Object.assign(methods, {
            [functionName]: (value: any) => {
                const prop = map.get(value);
                if (!prop) {
                    throw new Error(`${functionName} '${value}' not found.`);
                }
                return prop;
            }
        });
    }
    const uni = Object.assign(newUni, methods);
    return uni as UniProps<Props>;
}
export class Uni {
    toString() {
        return `Uni[${Object.keys(this).join(", ")}]`;
    }
}
export type UniProps<Props extends Record<keyof Props, UniPropValue<any>>> = {
    [K in keyof Props]: (value: Props[K]["value"]) => Props[K];
};
