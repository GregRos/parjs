import {
    comment,
    definitionLine,
    definitionList,
    EmptyLine,
    GlobalSection,
    globalSection,
    identifier,
    IniFile,
    iniFile,
    NamedSection,
    Property,
    section,
    sectionHeader,
    value
} from "../src/ini";

describe("comments", () => {
    it("can parse a ; comment", () => {
        expect(comment.parse("; this is a comment")).toBeSuccessful("this is a comment");
    });

    it("can parse a # comment", () => {
        expect(comment.parse("# this is a comment")).toBeSuccessful("this is a comment");
    });

    it("parse a comment at the end of the file", () => {
        expect(comment.parse("; this is a comment")).toBeSuccessful("this is a comment");
    });
});

describe("identifiers", () => {
    it("can parse a simple identifier", () => {
        expect(identifier.parse("abc")).toBeSuccessful("abc");
    });

    it("cannot be empty", () => {
        expect(identifier.parse("")).toBeFailure();
    });
});

describe("values", () => {
    it("can parse a simple value", () => {
        expect(value.parse("abc")).toBeSuccessful("abc");
    });

    it("cannot be empty", () => {
        expect(value.parse("")).toBeFailure();
    });

    it("can contain spaces", () => {
        expect(value.parse("abc def")).toBeSuccessful("abc def");
    });

    it("can contain tabs", () => {
        expect(value.parse("abc\tdef")).toBeSuccessful("abc\tdef");
    });
});

describe("definitionLine", () => {
    it("can parse a simple definition", () => {
        expect(definitionLine.parse("abc=def")).toBeSuccessful(new Property("abc", "def"));
    });

    it("can parse a definition with spaces", () => {
        expect(definitionLine.parse("abc = def ")).toBeSuccessful(new Property("abc", "def "));
    });

    it("can parse a definition with tabs", () => {
        expect(definitionLine.parse("abc\t=\tdef ")).toBeSuccessful(new Property("abc", "def "));
    });

    it("can parse a definition with a comment", () => {
        expect(definitionLine.parse("abc=def ; comment")).toBeSuccessful(
            new Property("abc", "def ")
        );
    });

    it("converts the name to lowercase", () => {
        expect(definitionLine.parse("ABC=def")).toBeSuccessful(new Property("abc", "def"));
    });
});

describe("definitionList", () => {
    it("can parse many definitions", () => {
        const input = [
            //
            "abc=def",
            "ghi=jkl"
        ].join("\n");
        expect(definitionList.parse(input)).toBeSuccessful([
            new Property("abc", "def"),
            new Property("ghi", "jkl")
        ]);
    });

    it("can have empty lines between definitions", () => {
        const input = [
            //
            "abc=def",
            "",
            "ghi=jkl"
        ].join("\n");
        expect(definitionList.parse(input)).toBeSuccessful([
            new Property("abc", "def"),
            new EmptyLine(),
            new Property("ghi", "jkl")
        ]);
    });

    it("can have empty lines with comments between definitions", () => {
        const input = [
            //
            "abc=def",
            "; comment",
            "ghi=jkl"
        ].join("\n");
        expect(definitionList.parse(input)).toBeSuccessful([
            new Property("abc", "def"),
            new EmptyLine(),
            new Property("ghi", "jkl")
        ]);
    });
});

describe("section headers", () => {
    it("can parse a simple section header", () => {
        expect(sectionHeader.parse("[abc]")).toBeSuccessful("abc");
    });

    it("cannot be empty", () => {
        expect(sectionHeader.parse("[]")).toBeFailure();
    });

    it("can contain spaces", () => {
        expect(sectionHeader.parse("[abc def]")).toBeSuccessful("abc def");
    });

    it("can contain tabs", () => {
        expect(sectionHeader.parse("[abc\tdef]")).toBeSuccessful("abc\tdef");
    });

    it("can have a comment at the end", () => {
        expect(sectionHeader.parse("[abc] ; comment")).toBeSuccessful("abc");
    });
});

describe("sections", () => {
    it("can parse a simple section", () => {
        const input = [
            //
            "[abc]",
            "def=ghi",
            "jkl=mno"
        ].join("\n");
        expect(section.parse(input)).toBeSuccessful(
            new NamedSection("abc", [new Property("def", "ghi"), new Property("jkl", "mno")])
        );
    });
});

describe("global section", () => {
    it("can parse a simple global section", () => {
        const input = [
            //
            "def=ghi",
            "",
            "; comment",
            "jkl=mno"
        ].join("\n");
        expect(globalSection.parse(input)).toBeSuccessful(
            new GlobalSection([
                new Property("def", "ghi"),
                new EmptyLine(),
                new EmptyLine(),
                new Property("jkl", "mno")
            ])
        );
    });
});

describe("ini file", () => {
    it("can parse a simple ini file", () => {
        const input = [
            "; This is the global section",
            "globalKey1=globalValue1",
            "globalKey2=globalValue2",
            "",
            "[Section1]",
            "Key1=Value1",
            "; line comment",
            "# another line comment",
            "Key2=Value2",
            "[Section2]",
            "KeyA=ValueA",
            "",
            "KeyB=ValueB"
        ].join("\n");
        expect(iniFile.parse(input)).toBeSuccessful(
            new IniFile(
                new GlobalSection([
                    new EmptyLine(),
                    new Property("globalkey1", "globalValue1"),
                    new Property("globalkey2", "globalValue2"),
                    new EmptyLine()
                ]),
                [
                    new NamedSection("Section1", [
                        new Property("key1", "Value1"),
                        new EmptyLine(),
                        new EmptyLine(),
                        new Property("key2", "Value2")
                    ]),
                    new NamedSection("Section2", [
                        new Property("keya", "ValueA"),
                        new EmptyLine(),
                        new Property("keyb", "ValueB")
                    ])
                ]
            )
        );
    });

    it("isn't required to have a global section", () => {
        const input = ["[Section1]", "Key1=Value1"].join("\n");
        expect(iniFile.parse(input)).toBeSuccessful(
            new IniFile(new GlobalSection([]), [
                new NamedSection("Section1", [new Property("key1", "Value1")])
            ])
        );
    });

    it("can have an empty section", () => {
        const input = ["[Section1]", ""].join("\n");
        expect(iniFile.parse(input)).toBeSuccessful(
            new IniFile(new GlobalSection([]), [new NamedSection("Section1", [])])
        );
    });

    it("can have no contents", () => {
        const input = "";
        expect(iniFile.parse(input)).toBeSuccessful(new IniFile(new GlobalSection([]), []));
    });
});
