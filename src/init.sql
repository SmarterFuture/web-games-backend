CREATE TABLE
    IF NOT EXISTS public.auth (
        "uname" VARCHAR(15) NOT NULL,
        "password" VARCHAR(32) NOT NULL
    );


CREATE INDEX "idx_uname" ON public.auth USING HASH ("uname");
