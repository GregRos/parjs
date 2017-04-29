/**
 * @module parjs/internal/implementation
 */ /** */
/**
 * @external
 */
export declare namespace Issues {
    function stringWrongLength(name: string, lengthHint: string): void;
    function mixedLoudnessNotPermitted(name: string): void;
    function guardAgainstInfiniteLoop(name: string): void;
    function quietParserNotPermitted(name: string): void;
    function expectedFailureKind(name: string): void;
    function willAlwaysFail(name: string): void;
}
