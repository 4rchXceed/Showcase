import { showError } from "../../error/err_client";

/**
 * GET request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function get(endpoint: String, fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`);
    } catch (e) {
        showError(`Data-loading request failed (please contact the server admin).`);
        return;
    }
    if (requ.ok) {
        if (requ.status === 200) {
            let json;
            try {
                json = await requ.json();
            } catch (e) {
                json = null;
            }
            return json;
        }
    }
    showError(`Data-loading request failed with status ${requ.status}.`);
    return null;
}