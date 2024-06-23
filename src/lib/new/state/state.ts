import type { ParjsStack } from "../stack/stack";

export interface UserState {
    [key: string]: unknown;
}

interface _State<T> {
    stack: ParjsStack;
    userState: UserState;
    initialUserState: UserState | undefined;
}
