import type { Sub } from "../types/db/sub";
import { getSubChilds } from "./get_childs";
import { getRealElement } from "./resolvepath";

async function next(tree: Sub, fetch: typeof globalThis.fetch): Promise<Sub> {
    let real: Sub = tree;
    if (tree.isVirtual) {
        real = await getRealElement(tree, fetch) ?? tree;
        real.fullPath = tree.fullPath;
    }


    const children = await getSubChilds(real, fetch, true);



    if (!tree.subs) {
        tree.subs = [];
    }

    for (const sub of children) {
        if (!sub.isBuiltin) {
            tree.subs.push(await next(sub, fetch));
        }
    }

    return tree;
}

export async function getTree(sub: Sub | null, fetch: typeof globalThis.fetch) {
    if (!sub) {
        let subs = await getSubChilds(null, fetch, true);
        let subsProcessed: Sub[] = [];
        for (const sub of subs) {
            subsProcessed.push(await next(sub, fetch));
        }
        const finalTree: Sub = {
            id: null,
            fullPath: null,
            name: "[Root]",
            subId: null,
            description: "The [root] sub",
            subs: subsProcessed,
            parent: null,
            isVirtual: false,
            targetId: null,
            originalId: null,
            isBuiltin: false
        }
        return finalTree;
    } else {
        return await next(sub, fetch);
    }
}
