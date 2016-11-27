/**
 * Created by lifeg on 24/11/2016.
 */

interface ValueResult<T> {
    result : T;
    hasResult : true;
    state : any;
}

interface NoValueResult {
    hasResult : false;
    state : any;
}
