import test, {Macro} from "ava";

type CharCases = {
    true: string[],
    false: string[]
};
export const charIndicatorTest: Macro<[(x: any) => boolean, CharCases]> = (
    t, f, cases) => {
    for (let cr of cases.true) {
        t.true(f(cr), `expected true for ${cr}`);
    }

    for (let cr of cases.false) {
        t.false(f(cr), `expected false for ${cr}`);
    }
};

export function defineIndicatorTest(
    title: string, f: (x: any) => boolean, cases: CharCases) {
    test(title, charIndicatorTest, f, cases);
}
