import { getSubChilds } from '$lib/utils/site/get_childs';
import { resolvePath } from '$lib/utils/site/resolvepath';
import type { ModifySubPageData } from '$lib/utils/types/mod_sub';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<ModifySubPageData> => {
    if (params.path) {
        const path = await resolvePath(params.path, fetch);
        if (path && !path.isVirtual) {
            return { subs: path, full: params.path, parentChilds: path.parent ? await getSubChilds(path.parent, fetch) : [] };
        } else {
            return { subs: null, full: params.path, parentChilds: [] };
        }
    } else {
        return { subs: null, full: "", parentChilds: [] };
    }
};
