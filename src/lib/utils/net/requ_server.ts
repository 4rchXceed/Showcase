import { showError } from "$lib/utils/error/err_client";

async function requMgr(requ: Response, avoidErrors: boolean) { // Internal call to handle fetch responses
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
    if (!avoidErrors) {
        showError(`Data-loading request failed with status ${requ.status}.`);
    }
    return null;
}

/**
 * GET request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function get(endpoint: string, fetch: typeof globalThis.fetch, avoidErrors: boolean = false): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        if (!avoidErrors) {
            showError(`Data-loading request failed (please contact the server admin).`);
        }
        return null;
    }
    return await requMgr(requ, avoidErrors);
}

/**
 * GET request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function _delete(endpoint: string, fetch: typeof globalThis.fetch, avoidErrors: boolean = false): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE",
        });
    } catch (e) {
        if (!avoidErrors) {
            showError(`Data-loading request failed (please contact the server admin).`);
        } return;
    }
    return await requMgr(requ, avoidErrors);
}

/**
 * POST request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param body The body to send
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function post(endpoint: string, body: any, fetch: typeof globalThis.fetch, avoidErrors: boolean = false): Promise<any> {
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
        if (!avoidErrors) {
            showError(`Data-loading request failed (please contact the server admin).`);
        } return;
    }
    return await requMgr(requ, avoidErrors);
}


/**
 * POST request to the backend
 * @param endpoint The endpoint (e.g. /subs)
 * @param body The body to send
 * @param fetch The fetch function got from +page.ts
 * @returns null if error + shows error, else the data
 */
export async function put(endpoint: string, body: any, fetch: typeof globalThis.fetch, avoidErrors: boolean = false): Promise<any> {
    let requ;
    try {
        requ = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    } catch (e) {
        if (!avoidErrors) {
            showError(`Data-loading request failed (please contact the server admin).`);
        } return;
    }
    return await requMgr(requ, avoidErrors);
}
