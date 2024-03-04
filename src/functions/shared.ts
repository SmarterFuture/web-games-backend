import { is, Describe } from "superstruct";


type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

const Ok = <T>(arg: T ) => { return { ok: true, data: arg } as Result<T, never>; };
const Err = <E>(arg: E ) => { return { ok: false, error: arg } as Result<never, E>; };


export function validate<T> (body: any , type: Describe<T>): Result<T, string> {
    if ( body === undefined ) {
        return Err("No data");
    }
    if ( !is(body, type)) {
        return Err("Invalid data");
    }

    return Ok(body);
}
