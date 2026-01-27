import { getSubChilds } from '$lib/utils/site/get_childs';
import { resolvePath } from '$lib/utils/site/resolvepath';
import type { NewSubPageData } from '$lib/utils/types/new_sub';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<NewSubPageData> => {
    if (params.path) {
        const path = await resolvePath(params.path, fetch);
        if (path) {
            return { subs: path, full: params.path, childs: await getSubChilds(path, fetch) };
        } else {
            return { subs: null, full: params.path, childs: [] };
        }
    } else {
        return { subs: null, full: "", childs: [] };
    }
};
