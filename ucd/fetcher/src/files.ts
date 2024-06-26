/** Indexes all the files in the UCD. Currently hand-written. Does not include Unihan files. */
export namespace UCD {
    /** Information about joining and shaping Arabic characters based on context. */
    export const ArabicShaping = "ArabicShaping.txt" as const;
    /** Bidirectional mapping of bracket characters to their reversed forms for use in RTL modes. */
    export const BidiBrackets = "BidiBrackets.txt" as const;
    /** Bidirectional mapping of characters to a mirrored version for use in RTL modes. */
    export const BidiMirroring = "BidiMirroring.txt" as const;
    /** Block ranges and names. */
    export const Blocks = "Blocks.txt" as const;
    /** Case mapping for characters. */
    export const CaseFolding = "CaseFolding.txt" as const;
    /** Information about CJK characters. Unclear. Most is found in the Unihan. */
    export const CJKRadicals = "CJKRadicals.txt" as const;
    /** Don't know. */
    export const CompositionExclusions = "CompositionExclusions.txt" as const;
    /** How long it's been in the Unicode standard? */
    export const DerivedAge = "DerivedAge.txt" as const;
    /** Various properties of characters. */
    export const DerivedCoreProperties = "DerivedCoreProperties.txt" as const;
    /** Don't know. */
    export const DerivedNormalizationProps = "DerivedNormalizationProps.txt" as const;
    /** Width of characters in East Asian scripts, or when used in an East Asian contexts. */
    export const EastAsianWidth = "EastAsianWidth.txt" as const;
    /** Unclear. */
    export const EmojiSources = "EmojiSources.txt" as const;
    /** Mapping between CJK characters in legacy formats to Unicode Unified Ideograph form. */
    export const EquivalentUnifiedIdeograph = "EquivalentUnifiedIdeograph.txt" as const;
    /** Information about Hangul syllables. */
    export const HangulSyllableType = "HangulSyllableType.txt" as const;
    /** Don't know. */
    export const Jamo = "Jamo.txt" as const;
    /**
     * Information about the line breaking properties of characters, such as whether line breaks are
     * allowed before or after them.
     */
    export const LineBreak = "LineBreak.txt" as const;
    /** Don't know. */
    export const NameAliases = "NameAliases.txt" as const;
    /** Don't know. */
    export const NamedSequences = "NamedSequences.txt" as const;
    /** Don't know. */
    export const NamedSequencesProv = "NamedSequencesProv.txt" as const;
    /**
     * A semi-complete list of characters and alternative names for them. Uses a slightly different
     * format from other files.
     */
    export const NamesList = "NamesList.txt" as const;
    /** Don't know. */
    export const NormalizationCorrections = "NormalizationCorrections.txt" as const;
    /** Don't know. */
    export const NushuSources = "NushuSources.txt" as const;
    /** Aliases for property names. */
    export const PropertyAliases = "PropertyAliases.txt" as const;
    /**
     * Aliases for property values, such as category names, script names, block names, boolean
     * values, etc.
     */
    export const PropertyValueAliases = "PropertyValueAliases.txt" as const;
    /** Various properties for each character. */
    export const PropList = "PropList.txt" as const;
    /**
     * List of Unicode Scripts and the characters mapped to them. Each character is mapped to a
     * single Script.
     */
    export const Scripts = "Scripts.txt" as const;
    /**
     * In reality, some characters are used in multiple scripts. This file lists additional scripts
     * characters are used in. It can be seen as complementary to `Scripts.txt`.
     */
    export const ScriptExtensions = "ScriptExtensions.txt" as const;
    /** Don't know. */
    export const StandardizedVariants = "StandardizedVariants.txt" as const;
    /** Don't know. */
    export const TangutSources = "TangutSources.txt" as const;
    /**
     * The primary data file for Unicode. Contains codepoints, their primary names, their legacy
     * names, General Category, and a few other properties.
     *
     * Does not contain CJK ideographs. They are instead represented as beginning and ending
     * codepoints, with names of the form `<CJK Ideograph, First>..<CJK Ideograph, Last>`.
     */
    export const UnicodeData = "UnicodeData.txt" as const;
    /** Don't know. */
    export const USourceData = "USourceData.txt" as const;
    /** Don't know. */
    export const VerticalOrientation = "VerticalOrientation.txt" as const;

    /** The derived directionality property of characters. */
    export const DerivedBidiClass = "extracted/DerivedBidiClass.txt" as const;
    /**
     * Various derived binary properties of characters. These are computed as union/intersection of
     * other properties.
     */
    export const DerivedBinaryProperties = "extracted/DerivedBinaryProperties.txt" as const;
    /** Derived properties about how characters are combined, such as diacritics and so on. */
    export const DerivedCombiningClass = "extracted/DerivedCombiningClass.txt" as const;
    /** Derived properties about how characters are decomposed into others, such as using backspace. */
    export const DerivedDecompositionType = "extracted/DerivedDecompositionType.txt" as const;
    /** Expanded East Asian Width property? */
    export const DerivedEastAsianWidth = "extracted/DerivedEastAsianWidth.txt" as const;
    /** Expanded General Category property? */
    export const DerivedGeneralCategory = "extracted/DerivedGeneralCategory.txt" as const;
    /** Derived properties about how characters are joined together, such as for Arabic. */
    export const DerivedJoiningGroup = "extracted/DerivedJoiningGroup.txt" as const;
    /** Derived properties about how characters are joined together, such as for Arabic. */
    export const DerivedJoiningType = "extracted/DerivedJoiningType.txt" as const;
    /** Derived properties about line breaking before or after characters. */
    export const DerivedLineBreak = "extracted/DerivedLineBreak.txt" as const;
    /** Derived names for characters? */
    export const DerivedName = "extracted/DerivedName.txt" as const;
    /** Derived numeric properties for characters. */
    export const DerivedNumericType = "extracted/DerivedNumericType.txt" as const;
    /**
     * Derived numeric values for numeric characters, such as eastern Arabic numerals, Roman
     * numerals, etc.
     */
    export const DerivedNumericValues = "extracted/DerivedNumericValues.txt" as const;
    /**
     * Lists Emoji-related properties for characters, including:
     *
     * - Emoji
     * - Emoji_Presentation
     * - Emoji_Modifier
     * - Emoji_Modifier_Base
     * - Emoji_Component
     * - Extended_Pictographic
     */
    export const EmojiData = "emoji/emoji-data.txt" as const;
    /** Information about how emoji characters combine to modify them, such as skin tone modifiers. */
    export const EmojiVariationSequences = "emoji/emoji-variation-sequences.txt" as const;

    /** Any known filename in the UCD. */
    export type FileName = Extract<(typeof UCD)[keyof typeof UCD], string>;
}

// TODO: Add file names for Unihan contents.
