<script lang="ts">
    import { deleteSubWithChilds } from "$lib/site/actions/sub/delete_sub";
    import type { DeleteSubPageData } from "$lib/types/delete_sub";
    import Swal from "sweetalert2";

    export let data: DeleteSubPageData;

    (async () => {
        if (!data.subs) return; // To make VSCode happy

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `This will delete the sub s/${data.full} and all its child subs! This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
        if (confirm.isConfirmed) {
            deleteSubWithChilds(data.subs, fetch);
        }
    })();
</script>

{#if data.subs}
    <h1>Delete Sub: {data.full}</h1>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub {data.full} not found</h2>
{/if}
