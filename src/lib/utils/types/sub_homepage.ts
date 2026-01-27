import type { Sub } from "./db/sub";

export interface SubHomepageData {
    subs: Sub | null,
    full: string,
    childs: Sub[], // It's a sub homepage, so it shouldn't have many childs
}
