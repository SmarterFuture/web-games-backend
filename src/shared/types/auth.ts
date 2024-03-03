import { string, object, size } from "superstruct";


export const TsignUp = object({
    name: size(string(), 1, 15),
    password: size(string(), 4, 32)
});

// export type TsignUp = Infer<typeof VsignUp>;
