import { get } from "$lib/net/requ_server";
import type { Sub } from "$lib/types/db/sub";


async function next(currentSub: Sub, segments: string[], index: number, fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>): Promise<Sub | null> {
    if (index >= segments.length) {
        return currentSub;
    }
    const nextSegment = segments[index];
    const requ = await get(`subs/${currentSub.id}?_embed=subs`, fetch);
    if (requ && requ as Sub) {
        const sub = requ as Sub;
        if (sub.subs) {
            for (const subSub of sub.subs) {
                if (subSub.name === nextSegment) {
                    subSub.parent = currentSub;
                    return await next(subSub, segments, index + 1, fetch);
                }
            }
        }
    }
    return null;
}

async function fetchSubByName(name: String): Promise<Sub | null> {
    const res = await get(`subs?name=${name}`, fetch);
    if (res && Array.isArray(res) && res.length > 0) {
        return res[0] as Sub;
    }
    return null;
}


/**
 * Resolves a path to its corresponding Sub (and sub-subs).
 * @param path The path (e.g. /vocaloid/miku).
 * @returns The sub, with his sub-subs, or null
 */
export async function resolvePath(path: string): Promise<Sub | null> {
    const segments = path ? path.split('/') : [];
    if (segments.length > 0) {
        const root = await fetchSubByName(segments[0]);
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