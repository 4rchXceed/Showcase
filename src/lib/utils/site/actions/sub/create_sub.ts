import { post } from "$lib/utils/net/requ_server";
import { getRealElement } from "$lib/utils/site/resolvepath";
import type { Sub } from "$lib/utils/types/db/sub";
import { showError } from "$lib/utils/error/err_client";

export async function createSub(subName: string, parent: Sub | null, description: string, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    let body;
    if (parent) {
        let realParent = await getRealElement(parent, fetch);
        if (!realParent) {
            realParent = parent; // Root subs
        }
        body = {
            // id are auto-generated
            name: subName,
            subId: realParent.id,
            description: description,
        };
    } else {
        body = {
            name: subName,
            subId: null,
            description: description
        }
    }


    const requ = await post("subs", body, fetch);

    if (requ && requ as Sub) {
        return requ as Sub;
    } else {
        showError("Failed to create sub (please contact the server admin).");
    }
    return null;
}

export async function createVirtualSub(parent: Sub | null, target: Sub, name: string, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    let body;
    let realTarget = await getRealElement(target, fetch);
    if (!realTarget) {
        realTarget = target; // Root subs
    }
    if (parent) {
        let realParent = await getRealElement(parent, fetch);
        if (!realParent) {
            realParent = parent; // Root subs
        }

        body = {
            // id are auto-generated
            subId: realParent.id,
            targetId: realTarget.id,
            name: name,
        };
    } else {
        body = {
            subId: null,
            targetId: realTarget.id,
            name: name
        }
    }

    const requ = await post("virtual_sub", body, fetch); // TODO: Rename to virtual_subs in backend (or subs to sub)
    if (requ && requ as Sub) {
        return requ as Sub;
    } else {
        showError("Failed to create virtual sub (please contact the server admin).");
    }
    return null;
}

