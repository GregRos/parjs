/** @module char-info/unicode
 * */
/* tslint:disable:naming-convention */
/**
 * Unicode category names.
 */
export namespace UnicodeCategory {
    export const Letter = "L";
    export const LetterUppercase = "Lu";
    export const LetterLowercase = "Ll";
    export const LetterTitlecase = "Lt";
    export const LetterModifier = "Lm";
    export const LetterOther = "Lo";

    export const MarkNonspacing = "Mn";
    export const MarkSpacingCombining = "Mc";
    export const MarkEncloding = "Me";
    export const Mark = "M";

    export const NumberDecimalDigit = "Nd";
    export const NumberLetter = "Nl";
    export const NumberOther = "No";
    export const Number = "N";

    export const PunctuationConnector = "Pc";
    export const PunctuationDash = "Pd";
    export const PuncutationOpen = "Ps";
    export const PunctuationClose = "Pe";
    export const PunctuationInitialQuote = "Pi";
    export const PunctuationFinalQuote = "Pf";
    export const PunctuationOther = "Po";
    export const Punctuation = "P";

    export const SymbolMath = "Sm";
    export const SymbolCurrency = "Sc";
    export const SymbolModifier = "Sk";
    export const SymbolOther = "So";
    export const Symbol = "S";

    export const SeparatorSpace = "Zs";
    export const SeparatorLine = "Zl";
    export const SeparatorParagraph = "Zp";
    export const Separator = "Z";

    export const Custom_SeparatorVertical = "_Zv";

    export const OtherControl = "Cc";
    export const OtherFormat = "Cf";
    export const OtherSurrogate = "Cs";
    export const OtherPrivateUse = "Co";
    export const OtherNotAssigned = "Cn";
    export const Other = "C";
}
