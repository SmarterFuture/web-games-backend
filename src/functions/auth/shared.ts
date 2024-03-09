import { string, object, size, assign, nonempty } from "superstruct";


export const Tlogin = object({
    handle: size(string(), 1, 20),
    password: size(string(), 4, 50)
});

export const Tsignup = assign(
    Tlogin,
    object({
        name: nonempty(string())
    })
);

