export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export const Ok = <T>( arg: T ) => { return { ok: true, data: arg } as Result<T, never>; };
export const Err = <E>( arg: E ) => { return { ok: false, error: arg } as Result<never, E>; };

