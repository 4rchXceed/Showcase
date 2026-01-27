import type { Sub } from "./db/sub";

export interface ModifySubPageData {
    subs: Sub | null,
    full: string,
    parentChilds: Sub[]
}