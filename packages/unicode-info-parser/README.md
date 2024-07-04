# UCD Loader

This package fetches data from the Unicode Character Database (UCD), parses its tabular format, and returns a direct object representation of that data.

-   This package needs to be used from `Node.js` as a build step.
-   You can pick which data you want to retrieve, based on what is currently supported.
-   This package can make requests totaling around 20 MB and can load up to 100MB into memory.

This package only retrieves data. It doesn’t package, compress, or query it. It’s primarily designed to be used by the `char-info` package, a dependency of `parjs`.

# Currently Supported

The UCD includes a large amount of data. **While the aim of this package is to eventually support all of it**, the current version primarily:

-   🛠️ Builds the tools for which this can be accomplished.
-   🏗️ Loads core UCD data about categories, scripts, blocks, and character names.

On other hand, the package currently doesn’t include:

-   ❌ Locale-specific data, like `ArabicShaping` or the `Unihan`.
-   ❌ `ScriptExtensions`
-   ❌ Character mapping data, such as casing and mirroring.
-   ❌ Properties such as Emoji, BiDi, and so on.

## # References

Information the UCD, its components, its format and structure.

| Id    | Link                                                                          |
| ----- | ----------------------------------------------------------------------------- |
|       | [Introduction](https://www.unicode.org/ucd/)                                  |
| UAX44 | [UAX44: Unicode Character Database](https://www.unicode.org/reports/tr44/)    |
| UAX38 | [UAX38: Unicode Han Database (Unihan)](https://www.unicode.org/reports/tr38/) |
| UAX51 | [UAX51: Unicode Emoji](https://www.unicode.org/reports/tr51)                  |

## Source Files

These are the files currently used by this package.

| File                                                                                          | Used for                | Reference                                                                             |
| --------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| [UnicodeData.txt](https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt)              | Codepoint categories    | [UAX44#UnicodeData.txt](https://www.unicode.org/reports/tr44/#UnicodeData.txt)        |
| [Scripts.txt](https://www.unicode.org/Public/UCD/latest/ucd/Scripts.txt)                      | Script ranges and names | [UAX44#Scripts.txt](https://www.unicode.org/reports/tr44/#Scripts.txt)                |
| [Blocks.txt](https://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt)                        | Block ranges and names  | [UAX44#NameAliases.txt](https://www.unicode.org/reports/tr44/#Blocks.txt)             |
| [PropertyValueAliases.txt](https://www.unicode.org/Public/UCD/latest/ucd/PropertyAliases.txt) | Names of categories     | [UAX44#PropertyAliases.txt](https://www.unicode.org/reports/tr44/PropertyAliases.txt) |
