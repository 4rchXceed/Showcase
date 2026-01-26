import { showError } from "../../error/err_client";

async function requMgr(requ: Response) { // Internal call to handle fetch responses
    if (requ.ok) {
        if (requ.status === 200 || requ.status === 201) {
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

/**
 * GET request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function get(endpoint: string, fetch: typeof globalThis.fetch): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        showError(`Data-loading request failed (please contact the server admin).`);
        return null;
    }
    return await requMgr(requ);
}

/**
 * GET request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function _delete(endpoint: string, fetch: typeof globalThis.fetch): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE",
        });
    } catch (e) {
        showError(`Data-loading request failed (please contact the server admin).`);
        return;
    }
    return await requMgr(requ);
}

/**
 * POST request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param body The body to send
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function post(endpoint: string, body: any, fetch: typeof globalThis.fetch): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    } catch (e) {
        showError(`Data-loading request failed (please contact the server admin).`);
        return;
    }
    return await requMgr(requ);
}