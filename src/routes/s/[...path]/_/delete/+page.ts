import { resolvePath } from '$lib/utils/site/resolvepath';
import type { DeleteSubPageData } from '$lib/utils/types/delete_sub';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<DeleteSubPageData> => {
    if (params.path) {
        const path = await resolvePath(params.path, fetch);
        if (path) {
            return { subs: path, full: params.path };
        } else {
            return { subs: null, full: params.path };
        }
    } else {
        return { subs: null, full: "" };
    }
};
