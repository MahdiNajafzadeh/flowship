import ky from "ky";

export const api = ky.extend({
    prefix: "/api",
    credentials: "include",
});
