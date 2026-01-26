import type { Sub } from "$lib/types/db/sub";
import { resolvePath } from "$lib/site/resolvepath";
import { getSubChilds } from "./get_childs";


/**
 * Provide an unoptimized autocomplete for subs
 * @param query Query string (e.g. "s/vocaloid" or "vocaloid")
 * @param fetch The svelte fetch function
 * @returns The list of subs matching the query
 */
export async function autoComplete(query: string, fetch: typeof globalThis.fetch): Promise<Sub[]> {
    if (query.startsWith("s/")) {
        query = query.slice(2);
    }
    if (!query) {
        return []; // We don't autocomplete root subs, as they are many
    }
    const path = await resolvePath(query, fetch);
    if (!path) {
        return [];
    }

    const children = await getSubChilds(path, fetch);

    return children;
}
