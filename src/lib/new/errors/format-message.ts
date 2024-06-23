// Tagged template that formats error messages:
export function getClassName(something: any) {
    if (typeof something !== "object") {
        return typeof something;
    }
    if (something === null) {
        return "null";
    }
    const ctorName = something.constructor?.name ?? something?.[Symbol.toStringTag] ?? "Object";
    return ctorName;
}

export function formatValue<T>(value: T): string | T {
    if (value === null) return "null";
    switch (typeof value) {
        case "string":
            return `"${value}"`;
        case "number":
        case "boolean":
            return value.toString();
        case "undefined":
            return "undefined";
        case "function":
            return `[function ${value.name}]`;
        case "bigint":
            return `${value}n`;
        case "symbol":
            return `@@${value.description}`;
    }
    return getClassName(value);
}

export function formatMessage(strings: TemplateStringsArray, ...values: unknown[]) {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
        result += formatValue(values[i]);
        result += strings[i + 1];
    }
    return result;
}
