import { goto } from "$app/navigation";
import { _delete, get } from "$lib/utils/net/requ_server";
import { toAbsolutePath } from "$lib/utils/path_utils";
import { getSubChilds as getSubChildren } from "$lib/utils/site/get_childs";
import { getRealElement } from "$lib/utils/site/resolvepath";
import type { Sub } from "$lib/utils/types/db/sub";
import Swal from "sweetalert2";


async function getRemoveSubSecure(sub: Sub, fetch: typeof globalThis.fetch, first: boolean = false): Promise<Sub[] | null> {
    const subsToDelete: Sub[] = []; // Add the current sub at the end
    const children = (await getSubChildren(sub, fetch)).filter(ch => !ch.isBuiltin); // Exclude builtin subs
    if (children.length > 0) {
        const choice = await Swal.fire({
            icon: "question",
            title: "Sub is not empty",
            text: "THIS DELETION WILL AFFECT CHILD SUBS + POSTS!!! ARE YOU ***REALLY*** SURE?",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
        });
        if (!choice.isConfirmed) {
            return null; // User cancelled
        }
    }

    for (const child of children) {
        if (!child.isVirtual) { // Virtual subs are deleted separately
            const subs = await getRemoveSubSecure(child, fetch);
            if (!subs) {
                return null; // User cancelled in recursion
            }
            subsToDelete.push(...subs);
        } else {
            subsToDelete.push(child); // Just add virtual subs directly
        }
    }

    const fromVirtualSubs = await get(`virtual_sub?subId=${sub.id}`, fetch);
    if (fromVirtualSubs && fromVirtualSubs as Sub[]) {
        const vSubs = fromVirtualSubs as Sub[];
        for (const vSub of vSubs) {
            if (vSub.parent) {
                vSub.isVirtual = true; // Mark as virtual for deletion
                subsToDelete.push(vSub);
            }
        }
    }

    const toVirtualSubs = await get(`virtual_sub?targetId=${sub.id}`, fetch);
    if (toVirtualSubs && toVirtualSubs as Sub[]) {
        const vSubs = toVirtualSubs as Sub[];
        for (const vSub of vSubs) {
            vSub.isVirtual = true; // Mark as virtual for deletion
            subsToDelete.push(vSub);
        }
    }

    if (first) { // Final confirmation at the top level, because we already have a message if a child has childrens
        const finalCheck = await Swal.fire({
            icon: "warning",
            title: "Final Confirmation",
            html: `You are about to delete the sub <strong>s/${sub.fullPath}</strong> and all its childs (${subsToDelete.length} subs/link in total). You can still contact the server admin to recover data after deletion.<br><br>Are you absolutely sure you want to proceed?`,
            showCancelButton: true,
            confirmButtonText: "Yes, delete all!",
            cancelButtonText: "No, cancel",
        });
        if (!finalCheck.isConfirmed) {
            return null; // User cancelled
        }
    }

    subsToDelete.push(sub); // Add the current sub at the end
    return subsToDelete;
}

async function deleteSub(sub: Sub, fetch: typeof globalThis.fetch): Promise<boolean> {
    if (sub.isVirtual) {
        const requ = await _delete(`virtual_sub/${sub.id}`, fetch);
        if (requ) {
            return true;
        } else {
            return false;
        }
    }
    const requ = await _delete(`subs/${sub.id}`, fetch);
    if (requ) {
        return true;
    } else {
        return false;
    }
}

export async function deleteSubWithChilds(sub: Sub, fetch: typeof globalThis.fetch): Promise<boolean> {
    if (sub.isVirtual) { // We don't delete virtual subs
        return false;
    }
    let realSub = await getRealElement(sub, fetch);
    if (!realSub) {
        realSub = sub; // Root subs
    }
    const subsToDelete = await getRemoveSubSecure(realSub, fetch, true);

    if (!subsToDelete) {
        location.href = toAbsolutePath("../../"); // Set the location to the parent (_/delete)
        return false; // User cancelled
    }

    for (const subToDelete of subsToDelete) {
        await deleteSub(subToDelete, fetch);
        // No success control, as there are sometimes errors (we'll just log them)
        console.log("Error at: ", subToDelete);
    }

    await Swal.fire({
        icon: "success",
        title: "Success...",
        text: `Sub s/${sub.fullPath} and its childs (${subsToDelete.length}) have been deleted successfully.`,
    });
    location.href = toAbsolutePath("../../../"); // Set the location to the parent (_/delete)
    return true;
}

export async function deleteVirtualSub(sub: Sub, fetch: typeof globalThis.fetch): Promise<boolean> {
    if (!sub.isVirtual || !sub.originalId) return false;
    const requ = await _delete(`virtual_sub/${sub.originalId}`, fetch);
    if (requ) {
        await Swal.fire({
            icon: "success",
            title: "Success...",
            text: `Virtual sub link s/${sub.fullPath} has been deleted.`,
        });
    }
    location.href = toAbsolutePath("../../../"); // Set the location to the parent (_/delete)

    return requ !== null;
}