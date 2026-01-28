import type { Sub } from "./db/sub";

export interface NewSubPageData {
    subs: Sub | null,
    full: string,
    childs: Sub[],
    parentChilds: Sub[],
}