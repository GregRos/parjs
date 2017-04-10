/**
 * Created by lifeg on 25/03/2017.
 */

export class _StringHelpers {
    recJoin(arr : any) : string {
        if (arr instanceof Array) {
            return arr.map(x => this.recJoin(x)).join("")
        } else {
            return String(arr);
        }
    }
}

export const StringHelpers = new _StringHelpers();