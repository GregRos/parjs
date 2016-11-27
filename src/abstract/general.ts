/**
 * Created by User on 21-Nov-16.
 */
interface ParsingState {
    readonly input : string;
    position : number;
    result : any;
    state : any;
    readonly signal : ParsingSignalInterface;
}

interface ParsingSignalInterface {
    warn(text : string);
}
