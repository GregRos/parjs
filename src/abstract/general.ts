

type MessageType = any;

interface ParsingResult {
    value : any;
    kind : ResultKind;
    readonly isOk : boolean;
    readonly isSoft : boolean;
    readonly isHard : boolean;
    readonly isFatal : boolean;
    message : MessageType;
}

/**
 * Created by User on 21-Nov-16.
 */
interface ParsingState {
    readonly input : string;
    position : number;
    value : any;
    state : any;
    result : ParsingResult;
}

interface ParsingSignalInterface {
    warn(text : string);
}
