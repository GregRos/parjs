import {IntOptions} from "../../implementation/parsers/numbers/int";
import {FloatOptions} from "../../implementation/parsers/numbers/float";
import {LoudParser} from "../combinators/loud";
/**
 * Created by User on 14-Dec-16.
 */

export interface NumericParsers {
    int(options ?: IntOptions) : LoudParser<number>;

    float(options ?: FloatOptions) : LoudParser<number>
}