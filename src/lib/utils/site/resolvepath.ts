import { get } from "$lib/utils/net/requ_server";
import type { Sub } from "$lib/utils/types/db/sub";

/**
 * Gett the *real* element of a Sub (not a virtual one), helps for sub creation, so we know where to put it
 * @param sub The sub to get the real element from
 * @param fetch The svelte fetch function
 * @returns The real element Sub, or null if root
 */
export async function getRealElement(sub: Sub, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    if (!sub) {
        return null;
    }

    if (sub.isVirtual) {
        const requ = await get(`subs/${sub.targetId}`, fetch);
        if (requ && requ as Sub) {
            return requ as Sub;
        } else {
            return null;
        }
    }
    return sub;
}

/**
 * Recursive function to resolve each segments (/) of a path
 * @param currentSub The Sub obj, with the parents as sub.parent
 * @param segments The segments of the path (vocaloid/miku -> ["vocaloid", "miku", ...])
 * @param index Current index in the segments array
 * @param fetch The svelte fetch function
 * @returns The Sub object or null if not found
 */
async function next(currentSub: Sub, segments: string[], index: number, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    if (index >= segments.length) {
        return currentSub;
    }
    const nextSegment = segments[index];
    const requ = await get(`subs/${currentSub.id}?_embed=subs`, fetch);
    if (requ && requ as Sub) {
        const sub = requ as Sub;
        let found = false;
        if (sub.subs) {
            for (const subSub of sub.subs) {
                if (subSub.name === nextSegment) {
                    subSub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${subSub.name}` : subSub.name;
                    subSub.parent = currentSub;
                    found = true;
                    return await next(subSub, segments, index + 1, fetch);
                }
            }
        }

        if (!found) { // Try virtual subs
            const virtualRequ = await get(`virtual_sub?subId=${currentSub.id}`, fetch);
            if (virtualRequ && virtualRequ as Sub[]) {
                const subs = virtualRequ as Sub[];
                for (const sub of subs) {
                    if (sub.name === nextSegment) {
                        sub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${sub.name}` : sub.name;
                        sub.parent = currentSub;
                        sub.isVirtual = true;
                        sub.description = "(Virtual Link)";
                        sub.originalId = sub.id;
                        sub.id = sub.targetId; // Small "hack" to make virtual subs work properly

                        found = true;
                        return await next(sub, segments, index + 1, fetch);
                    }
                }
            }
        }

        if (!found) { // builtin sub
            const builtinSubRequ = await get(`builtin_sub?name=${nextSegment}`, fetch);
            if (builtinSubRequ && builtinSubRequ as Sub[] && (builtinSubRequ as Sub[]).length > 0) {
                const sub = builtinSubRequ[0] as Sub;
                sub.parent = currentSub;
                sub.description = `"${sub.name}" category of s/${sub.parent.fullPath}`;
                sub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${sub.name}` : sub.name;
                sub.isBuiltin = true;
                found = true;
                return sub;
            }
        }

    }
    return null;
}

async function fetchSubByName(name: string, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    const res = await get(`subs?name=${name}`, fetch, true);
    if (res && Array.isArray(res) && res.length > 0) {
        const sub = res[0] as Sub;
        sub.fullPath = name;
        return sub;
    }
    // Fallback to virtual
    const resVirtual = await get(`virtual_sub?name=${name}&subId=null`, fetch);

    if (resVirtual && Array.isArray(resVirtual) && resVirtual.length > 0) {
        const sub = resVirtual[0] as Sub;
        sub.fullPath = name;
        sub.isVirtual = true;
        sub.description = "(Virtual sub)";
        sub.originalId = sub.id;
        sub.id = sub.targetId;
        return sub;
    }
    return null;
}


/**
 * Resolves a path to its corresponding Sub (and sub-subs).
 * @param path The path (e.g. /vocaloid/miku).
 * @param fetch The svelte fetch function.
 * @returns The sub, with his sub-subs, or null
 */
export async function resolvePath(path: string, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    const segments = path ? path.split('/') : [];
    if (segments.length > 0) {
        const root = await fetchSubByName(segments[0], fetch);

        if (root) {
            if (segments.length === 1) {
                return root;
            } else {
                return await next(root, segments, 1, fetch);
            }
        }

    }
    return null;
}

async function nextReverse(currentSub: Sub, path: string, fetch: typeof globalThis.fetch): Promise<Sub> {
    const parentRequ = await get(`subs/${currentSub.id}?_embed=sub`, fetch);
    if (parentRequ && (parentRequ as { sub: Sub }).sub) {
        const parentSub = (parentRequ as { sub: Sub }).sub as Sub;
        parentSub.fullPath = path ? `${parentSub.name}/${path}` : parentSub.name;
        parentSub.subs = [currentSub];
        return await nextReverse(parentSub, parentSub.name + "/" + path, fetch);
    }
    return currentSub;
}

/**
 * Get the full path of a Sub by it's id (object)
 * @param sub the sub object (from getRealElement for example)
 * @param fetch The svelte fetch function
 * @returns The Sub with fullPath filled, or null
 */
export async function reverseResolvePath(sub: Sub, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    const untransformedPath = await nextReverse(sub, "", fetch);
    // Now, we need to transform it to have the full subs tree (one like in resolvePath)

    if (untransformedPath) {
        // First find the lowest child
        let lowestChild: Sub | null = untransformedPath;
        let found = false;
        let currentSub: Sub | null = untransformedPath;
        while (!found) {
            if (currentSub.subs && currentSub.subs.length > 0) {
                lowestChild = currentSub.subs[0];
                currentSub = lowestChild;
            } else {
                found = true;
            }
        }

        // The do the inverse path
        found = false;
        currentSub = untransformedPath;
        let tmpSub: Sub | null = currentSub;
        while (!found) {
            if (currentSub.subs && currentSub.subs.length > 0) {
                tmpSub = currentSub.subs[0];
                tmpSub.fullPath = currentSub.fullPath ? `${currentSub.fullPath}/${tmpSub.name}` : tmpSub.name;
                tmpSub.parent = currentSub;
                currentSub.subs = [];
                currentSub = tmpSub;
            } else {
                found = true;
            }
        }
        return currentSub;
    }
    return null;
}