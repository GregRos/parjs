import { Fetcher, UCD } from "@unimatch/fetcher";

const [propertyNameAliases, derivedCoreProperties, emojiData] = await Promise.all([
    Fetcher.fetchParsed(UCD.PropertyValueAliases),
    Fetcher.fetchParsed(UCD.DerivedCoreProperties),
    Fetcher.fetchParsed(UCD.EmojiData)
]);
