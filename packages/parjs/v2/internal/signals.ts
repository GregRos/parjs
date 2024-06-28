export type OkaySignal<R> = {
    readonly kind: SignalKind.Okay;
    readonly value: R;
};
export type FailSignal = {
    readonly kind: SignalKind.Fail;
    readonly reason: string;
};
export type PanicSignal = {
    readonly kind: SignalKind.Panic;
    readonly reason: string;
};
export type DieSignal = {
    readonly kind: SignalKind.Die;
    readonly reason: string;
};
export type NotOkaySignal = FailSignal | PanicSignal | DieSignal;
export type Signal<R> = OkaySignal<R> | NotOkaySignal;
export type tmp_Signal<R> = Signal<R>;
export const enum SignalKind {
    Okay = 1,
    Fail = 2,
    Panic = 3,
    Die = 4
}
export function isOkay<R>(signal: Signal<R>): signal is OkaySignal<R> {
    return signal.kind == SignalKind.Okay;
}

export function isFail<R>(signal: Signal<R>): signal is FailSignal {
    return signal.kind == SignalKind.Fail;
}

export function isPanic<R>(signal: Signal<R>): signal is PanicSignal {
    return signal.kind == SignalKind.Panic;
}

export function isDie<R>(signal: Signal<R>): signal is DieSignal {
    return signal.kind == SignalKind.Die;
}
