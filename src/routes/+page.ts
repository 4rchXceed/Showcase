import { getSubChilds } from '$lib/utils/site/get_childs';
import type { HomepageData } from '$lib/utils/types/homepage';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }): Promise<HomepageData> => {
	const res = await getSubChilds(null, fetch);

	if (res) {
		return { subs: res };
	} else {
		return { subs: [] };
	}

};
