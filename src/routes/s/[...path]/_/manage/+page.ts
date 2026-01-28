import { getSubChilds } from '$lib/utils/site/get_childs';
import { getRealElement, resolvePath, reverseResolvePath } from '$lib/utils/site/resolvepath';
import type { ModifySubPageData } from '$lib/utils/types/mod_sub';
import { redirect } from '@sveltejs/kit';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<ModifySubPageData> => {
    if (params.path) {
        const path = await resolvePath(params.path, fetch);
        if (path?.isVirtual) {
            const realPath = await getRealElement(path, fetch);
            if (!realPath) {
                redirect(307, "/s/" + params.path + "/_/manage");
            } else {
                const realPathFull = await reverseResolvePath(realPath, fetch);
                console.log(realPathFull);
                if (!realPathFull) {
                    redirect(307, "/s/" + params.path + "/_/manage");
                }
                redirect(307, "/s/" + realPathFull.fullPath + "/_/manage");
            }
        }
        if (path && !path.isVirtual) {
            return { subs: path, full: params.path, parentChilds: path.parent ? await getSubChilds(path.parent, fetch) : [] };
        } else {
            return { subs: null, full: params.path, parentChilds: [] };
        }
    } else {
        return { subs: null, full: "", parentChilds: [] };
    }
};
