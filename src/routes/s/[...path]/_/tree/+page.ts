import { getTree } from '$lib/utils/site/get_tree';
import { resolvePath } from '$lib/utils/site/resolvepath';
import type { TreeViewPageData } from '$lib/utils/types/tree';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<TreeViewPageData> => {
    if (params.path) {
        const path = await resolvePath(params.path, fetch);
        if (path) {
            return { tree: await getTree(path, fetch), full: params.path }
        }
    } else {
        return { tree: await getTree(null, fetch), full: "" }
    }
    return { tree: null, full: "" };
};
