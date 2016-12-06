import {Parjs} from "../src/bindings/parsers";
/**
 * Created by lifeg on 07/12/2016.
 */
describe("smoke test", () => {
   let parser = Parjs.anyChar;
   let input = "a";
   let failInput = "";
   expect("can parse", () => {
       let result = parser.parse(input);
       result.
   })
});