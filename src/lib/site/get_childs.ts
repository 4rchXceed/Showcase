import { get } from "$lib/net/requ_server";
import type { Sub } from "$lib/types/db/sub";

/**
 * Get the childs (real and virtual) of a Sub
 * @param currentSub The sub object (can be gotten with resolvePath)
 * @param fetch The svelte fetch function
 * @returns The list of childs (as Sub[] object)
 */
export async function getSubChilds(currentSub: Sub, fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>): Promise<Sub[]> {
    const requReal = await get(`subs/${currentSub.id}?_embed=subs`, fetch); // Fetch "real" subs
    const requVirtual = await get(`virtual_sub?subId=${currentSub.id}`, fetch); // Fetch virtual subs

    let children: Sub[] = [];

    if (requReal && requReal as Sub) {
        const sub = requReal as Sub;
        if (sub.subs) {
            for (const subSub of sub.subs) {
                subSub.parent = currentSub;
                subSub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${subSub.name}` : subSub.name;

                children.push(subSub);
            }
        }
    }

    if (requVirtual && requVirtual as Sub[]) {
        const subs = requVirtual as Sub[];
        if (subs) {
            for (const sub of subs) {
                sub.parent = currentSub;
                sub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${sub.name}` : sub.name;
                sub.description = "(Virtual Link)";
                sub.isVirtual = true;
                children.push(sub);
            }
        }
    }

    return children;
}