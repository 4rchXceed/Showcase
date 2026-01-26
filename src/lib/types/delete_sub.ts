import type { Sub } from "./db/sub";

export interface DeleteSubPageData {
    full: string,
    subs: Sub | null
}