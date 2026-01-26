import { get } from '$lib/net/requ_server';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await get("subs?_limit=10&subId=null", fetch);
	if (res) {
		return { subs: res };
	} else {
		return { subs: [] };
	}

};
