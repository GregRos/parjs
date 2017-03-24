/**
 * Created by User on 24-Nov-16.
 */
export declare namespace Codes {
    const a: number;
    const f: number;
    const F: number;
    const z: number;
    const A: number;
    const Z: number;
    const zero: number;
    const nine: number;
    const newline: number;
    const carriageReturn: number;
    const space = 32;
    const tab = 8;
    const minus: number;
    const plus: number;
    const decimalPoint: number;
    const e: number;
    const E: number;
    const enQuad = 8192;
    const hairSpace = 8202;
    function isUnicodeInlineSpace(code: number): boolean;
    function isInlineSpace(code: number): boolean;
    function isArithmeticSign(code: number): boolean;
    function isBetween(code: number, start: number, end: number): boolean;
    function isDigit(code: number, base?: number): boolean;
    function digitValue(code: number): number;
    function isHex(code: number): boolean;
    function isAsciiLower(code: number): boolean;
    function isAsciiUpper(code: number): boolean;
    function isAsciiLetter(code: number): boolean;
    function isUnicodeNewline(s: number): boolean;
}
export declare namespace Chars {
    function isUpper(s: string): boolean;
    function isLower(s: string): boolean;
    function isDigit(s: string): boolean;
    function isAsciiLetter(s: string): boolean;
    function isHex(s: string): boolean;
    function isAsciiLower(s: string): boolean;
    function isTab(s: string): boolean;
    function isSpace(s: string): boolean;
    function isInlineSpace(s: string): boolean;
    function isUnicodeInlineSpace(s: string): boolean;
    function isAsciiUpper(s: string): boolean;
}
