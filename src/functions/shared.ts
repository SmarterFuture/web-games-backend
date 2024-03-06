import { is, Describe } from "superstruct";
import { Result, Err, Ok } from "../shared/types";


export function validateData<T> (body: any , type: Describe<T>): Result<T, string> {
    if ( body === undefined ) {
        return Err("No data");
    }
    if ( !is(body, type)) {
        return Err("Invalid data");
    }

    return Ok(body);
}
