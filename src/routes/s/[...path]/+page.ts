import { resolvePath } from '$lib/site/resolvepath';
import type { SubHomepageData } from '$lib/types/sub_homepage';
import type * as Kit from '@sveltejs/kit';

export const load: Kit.Load<{ path?: string | undefined }> = async ({ params, fetch }): Promise<SubHomepageData> => {
    if (params.path) {
        const path = await resolvePath(params.path);
        return { subs: path, full: params.path };
    } else {
        return { subs: null, full: "" };
    }
};
