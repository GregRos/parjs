/// <reference types="core-js" />
/**
 * Created by User on 21-Nov-16.
 */
export declare const QUIET_RESULT: any;
export declare const FAIL_RESULT: any;
export declare const UNINITIALIZED_RESULT: any;
export declare namespace Issues {
    function mixedLoudnessNotPermitted({displayName}: {
        displayName: string;
    }): void;
    function guardAgainstInfiniteLoop({displayName}: {
        displayName: string;
    }): void;
    function quietParserNotPermitted({displayName}: {
        displayName: string;
    }): void;
}
declare global  {
    interface Array<T> {
        maybePush(o: T): any;
    }
}
export {};
