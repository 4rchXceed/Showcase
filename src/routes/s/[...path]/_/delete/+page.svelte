<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import {
        deleteSubWithChilds,
        deleteVirtualSub,
    } from "$lib/utils/site/actions/sub/delete_sub";
    import type { DeleteSubPageData } from "$lib/utils/types/delete_sub";
    import Swal from "sweetalert2";

    export let data: DeleteSubPageData;

    (async () => {
        if (!data.subs) return; // To make VSCode happy
        let isConfirmed = false;
        if (data.subs.isVirtual) {
            const confirm = await Swal.fire({
                title: "Are you sure?",
                html: `This will delete the link s/${data.full}, <bold>the original sub WON'T be affected!</bold>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            });
            if (confirm.isConfirmed) {
                isConfirmed = true;
                deleteVirtualSub(data.subs, fetch);
            }
        } else {
            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: `This will delete the sub s/${data.full} and all its child subs! This action cannot be undone.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            });
            if (confirm.isConfirmed) {
                isConfirmed = true;
                deleteSubWithChilds(data.subs, fetch);
            } else {
            }
        }
        if (!isConfirmed) {
            if (browser) {
                location.href = toAbsolutePath("../../"); // Set the location to the parent (_/delete)
            }
        }
    })();
</script>

<svelte:head>
    <title>Delete Sub - s/{data.full} - Showcase</title>
</svelte:head>

{#if data.subs}
    <h1>Delete Sub: s/{data.full}</h1>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub s/{data.full} not found</h2>
{/if}
