export interface CharParser {
    readonly name: string;
    readonly parsed: number;
    read(count?: number): string | undefined;
}
