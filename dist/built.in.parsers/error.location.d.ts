export interface ErrorLocation {
    rowIndex: number;
    colPrefix: string;
}
export declare const infrastructure: symbol;
export declare function getPositionLocation(text: string, position: number): ErrorLocation;
export declare function visualizeError(input: string, position: number, location: ErrorLocation): string;
