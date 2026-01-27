import { get } from "$lib/utils/net/requ_server";
import type { Sub } from "$lib/utils/types/db/sub";

/**
 * Get the childs (real and virtual) of a Sub
 * @param currentSub The sub object (can be gotten with resolvePath)
 * @param fetch The svelte fetch function
 * @returns The list of childs (as Sub[] object)
 */
export async function getSubChilds(currentSub: Sub | null, fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, noerrMode = false): Promise<Sub[]> {
    let requReal;
    let requVirtual;
    let requBuiltin = []; // The root doesn't have builtin subs

    if (currentSub) {
        requReal = await get(`subs/${currentSub.id}?_embed=subs`, fetch, noerrMode); // Fetch "real" subs
        requVirtual = await get(`virtual_sub?subId=${currentSub.id}`, fetch, noerrMode); // Fetch virtual subs
        requBuiltin = await get(`builtin_sub`, fetch, noerrMode); // Fetch builtin subs
    } else { // Fetch root subs
        requReal = await get(`subs?subId=null`, fetch, noerrMode);
        requVirtual = await get(`virtual_sub?subId=null`, fetch, noerrMode);
    }


    let children: Sub[] = [];

    if (requReal && requReal as Sub) {
        if (currentSub) {
            const sub = requReal as Sub;
            if (sub.subs) {
                for (const subSub of sub.subs) {
                    subSub.parent = currentSub;
                    if (currentSub) {
                        subSub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${subSub.name}` : subSub.name;
                    } else {
                        subSub.fullPath = subSub.name;
                    }

                    children.push(subSub);
                }
            }
        } else {
            const subParent = requReal as Sub[];

            for (const subChild of subParent) {
                children.push(subChild);
            }
        }
    }

    if (requVirtual && requVirtual as Sub[]) {
        const subs = requVirtual as Sub[];
        if (subs) {
            for (const sub of subs) {
                if (sub.subId || !currentSub) {
                    sub.parent = currentSub
                    if (currentSub) {
                        sub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${sub.name}` : sub.name;
                    } else {
                        sub.fullPath = sub.name;
                    }
                    sub.description = "(Virtual Link)";
                    sub.isVirtual = true;
                    children.push(sub);
                }
            }
        }
    }

    if (requBuiltin && requBuiltin as Sub[]) {
        const subs = requBuiltin as Sub[];
        for (const sub of subs) {
            sub.parent = currentSub;
            if (currentSub) {
                sub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${sub.name}` : sub.name;
            } else {
                sub.fullPath = sub.name;
            }
            sub.description = `"${sub.name}" category of s/${sub.parent ? sub.parent.fullPath : "root <not supposed to happen>"}`;
            sub.isBuiltin = true;
            children.push(sub);
        }
    }

    return children;
}