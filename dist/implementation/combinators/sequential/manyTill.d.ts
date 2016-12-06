import { ParjsAction } from "../../../base/action";
/**
 * Created by User on 21-Nov-16.
 */
export declare class PrsManyTill extends ParjsAction {
    private many;
    private till;
    private tillOptional;
    isLoud: boolean;
    displayName: string;
    expecting: string;
    constructor(many: AnyParserAction, till: AnyParserAction, tillOptional: boolean);
    _apply(ps: ParsingState): void;
}
