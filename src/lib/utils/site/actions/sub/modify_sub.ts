import { put } from "$lib/utils/net/requ_server";
import type { Sub } from "$lib/utils/types/db/sub";

export async function modifySub(sub: Sub, newName: string, newDescription: string, isNewParentRoot = false, newParent: Sub | null = null, fetch: typeof globalThis.fetch): Promise<Sub | null> {
    if (sub.isVirtual) return null; // NO modification for virtual subs
    const body = {
        id: sub.id,
        name: newName,
        description: newDescription,
        subId: sub.subId
    }
    if (isNewParentRoot) {
        body.subId = null;
    } else {
        if (newParent) {
            body.subId = newParent.id;
        } else {
            if (sub.parent) {
                body.subId = sub.parent.id;
            }
        }
    }

    return await put(`subs/${sub.id}`, body, fetch);
}
