import { Parjser, anyCharOf, eof, newline, result, string } from "../lib";
import { many, map, or, qthen, stringify, then, thenq } from "../lib/combinators";
import { between, many1, maybe } from "../lib/internal/combinators";

// This is a parser for .ini files. It's a simple format that looks like this:
//
//     ; Global section
//     abc=def
//     ghi=jkl
//
//     [SectionName]
//     abc=def
//     ghi=jkl ; comment
//
//     [AnotherSection]
//     mno=pqr
//
// The parser is based on the following grammar:
// - Properties: These are key-value pairs, parsed by definitionLine. The keys
//   are case-insensitive.
// - Comments: These start with a ; or # and continue to the end of the line.
//   They can appear anywhere in the file, including on the same line as a
//   property.
// - Sections: These are groups of properties under a header, like
//   [SectionName]. The sectionHeader parser recognizes these headers.
// - Empty lines: These are recognized by the emptyLine parser. They can appear
//   anywhere in the file and are ignored by the parser.
// - Global Section: This is a special section that contains properties defined
//   before any named section.

export class Property {
    constructor(
        public readonly name: string,
        public readonly value: string
    ) {}
}

export class EmptyLine {}

export class NamedSection {
    constructor(
        public readonly name: string,
        public readonly properties: Property | EmptyLine[]
    ) {}
}

export class GlobalSection {
    constructor(public readonly properties: Property | EmptyLine[]) {}
}

export class IniFile {
    constructor(
        public readonly global: GlobalSection,
        public readonly sections: NamedSection[]
    ) {}
}

const maybeSpacesOrTabs = string(" ").pipe(or(string("\t")), many());
function token<T>(parser: Parjser<T>): Parjser<T> {
    return parser.pipe(between(maybeSpacesOrTabs));
}

const identifierCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
const valueCharacters = identifierCharacters + " \t";

export const comment = token(anyCharOf(";#"))
    .pipe(qthen(anyCharOf(valueCharacters).pipe(many(), stringify())))
    .expects("comment");

export const identifier = token(anyCharOf(identifierCharacters).pipe(many1(), stringify())).expects(
    "identifier"
);
export const value = anyCharOf(valueCharacters).pipe(many1(), stringify()).expects("value");

// parses a definition like `abc=def`.
// Note that definitions are case insensitive in .ini files
export const definitionLine = token(identifier)
    .pipe(
        thenq(token(string("="))),
        then(value, comment.pipe(maybe())),
        thenq(newline().pipe(or(eof()))),
        map(([name, val]) => new Property(name.toLowerCase(), val))
    )
    .expects("definition");

const emptyLine = comment
    .pipe(maybe(), qthen(maybeSpacesOrTabs))
    .pipe(qthen(newline()), qthen(result(new EmptyLine())))
    .expects("empty line");

// parses many definitions
export const definitionList = emptyLine
    .pipe(or(definitionLine), many())
    .expects("definitionSection");

export const sectionHeader = token(
    anyCharOf(valueCharacters).pipe(many1(), stringify(), between("[", "]"))
)
    .pipe(thenq(comment.pipe(maybe())))
    .expects("section header");

export const section = sectionHeader
    .pipe(
        thenq(newline()),
        then(definitionList),
        map(([name, properties]) => new NamedSection(name, properties))
    )
    .expects("section");

// parses the variables at the top of the file. These are called global because they are not
// associated with any section.
export const globalSection = definitionList
    .pipe(map(properties => new GlobalSection(properties)))
    .expects("global section");

export const iniFile = globalSection
    .pipe(
        then(section.pipe(many())),
        map(([global, sections]) => new IniFile(global, sections))
    )
    .expects("ini file");
