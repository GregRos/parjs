/**
 * @module parjs/internal/implementation/functions
 */ /** */
//NOTE: Although we do use the char-info package for recognizing characters, it's very big and it's not always necessary.
//This code is copied over from char-info for the purpose of recognizing basic characters so we don't import it unless the user wants.
export namespace Codes {
    export const a = 'a'.charCodeAt(0);
    export const f = 'f'.charCodeAt(0);
    export const F = 'F'.charCodeAt(0);
    export const z = 'z'.charCodeAt(0);
    export const A = 'A'.charCodeAt(0);
    export const Z = 'Z'.charCodeAt(0);
    export const zero = '0'.charCodeAt(0);
    export const nine = '9'.charCodeAt(0);
    export const newline = '\n'.charCodeAt(0);
    export const maxAnsi = 0xff;
    export const carriageReturn = '\r'.charCodeAt(0);
    export const space = 0x0020;
    export const tab = 0x0008;
    export const minus = '-'.charCodeAt(0);
    export const plus = '+'.charCodeAt(0);
    export const decimalPoint = ".".charCodeAt(0);
    export const e = a + 4;
    export const E = A + 4;
    export const underscore = "_".charCodeAt(0);

    export function isBetween(code : number, start : number, end : number) {
        return code >= start && code <= end;
    }

    export function isDigit(code : number, base = 10) {
        if (base <= 10) {
            return isBetween(code, zero, zero + base - 1)
        }
        if (base <= 37) {
            return isBetween(code, zero, nine) || isBetween(code, a, a + base - 11) || isBetween(code, A, A + base - 11);
        }
        return undefined;
    }

    export function digitValue(code : number) {
        if (isBetween(code, zero, nine)) {
            return code - zero;
        }
        if (isBetween(code, a, z)) {
            return 10 + code - a;
        }
        if (isBetween(code, A, Z)) {
            return 10 + code - A;
        }
        return undefined;
    }
}

export module AsciiCodeInfo {
	export function isAscii(code : number) {
		return code >= 0 && code <= Codes.maxAnsi;
	}

	export function isHex(code : number) {
		return code >= Codes.A && code <= Codes.F || code >= Codes.a && code <= Codes.f || code >= Codes.zero && code <= Codes.nine;
	}

	export function isDecimal(code : number) {
		return code >= Codes.zero && code <= Codes.nine;
	}

	export function isLetter(code : number) {
		return code >= Codes.a && code <= Codes.z || code >= Codes.A && code <= Codes.Z;
	}

	export function isUpper(code : number) {
		return code >= Codes.A && code <= Codes.Z;
	}

	export function isLower(code : number) {
		return code >= Codes.a && code <= Codes.z;
	}

	export function isNewline(code : number) {
		return code === Codes.carriageReturn || code === Codes.newline;
	}

	export function isSpace(code : number) {
		return code === Codes.space || code === Codes.tab;
	}

	export function isBinary(code : number) {
		return code === Codes.zero || code === Codes.zero + 1;
	}

	export function isWordChar(code : number) {
		return code >= Codes.A && code <= Codes.Z
			|| code >= Codes.zero && code <= Codes.nine
			|| code >= Codes.a && code <= Codes.z
			|| code === Codes.underscore
			|| code === Codes.minus;
	}
}

export module AsciiCharInfo {
	export function isAscii(code : string) {
		return AsciiCodeInfo.isAscii(code.charCodeAt(0));
	}


	export function isHex(code : string) {
		return AsciiCodeInfo.isHex(code.charCodeAt(0));
	}

	export function isDecimal(code : string) {
		return AsciiCodeInfo.isDecimal(code.charCodeAt(0));
	}

	export function isLetter(code : string) {
		return AsciiCodeInfo.isLetter(code.charCodeAt(0));
	}

	export function isUpper(code : string) {
		return AsciiCodeInfo.isUpper(code.charCodeAt(0));
	}

	export function isLower(code : string) {
		return AsciiCodeInfo.isLower(code.charCodeAt(0));
	}

	export function isNewline(code : string) {
		return AsciiCodeInfo.isNewline(code.charCodeAt(0));
	}

	export function isSpace(code : string) {
		return AsciiCodeInfo.isSpace(code.charCodeAt(0));
	}

	export function isBinary(code : string) {
		return AsciiCodeInfo.isBinary(code.charCodeAt(0));
	}

}
