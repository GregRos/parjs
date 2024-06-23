export abstract class Input {
    abstract read(length?: number): string;
    abstract position: number;
}
