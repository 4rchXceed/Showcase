<script lang="ts">
    import { goto } from "$app/navigation";
    import SubList from "$lib/components/SubList.svelte";
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import type { SubHomepageData } from "$lib/utils/types/sub_homepage";

    export let data: SubHomepageData;
</script>

<svelte:head>
    <title>ShowCase - s/{data.full}</title>
    <meta
        name="description"
        content="Check out the sub s/{data.full} on Showcase!"
    />
</svelte:head>

{#if data.subs}
    <h1>ShowCase - s/{data.full}</h1>
    <!-- Back Button -->
    <a href={"/s/" + data.full.substring(0, data.full.lastIndexOf("/"))}>Back</a
    >
    <article class="overflowtxt hover-card-anim">
        <header class="df">
            <div>
                <img
                    src="https://placehold.co/50x50/EEE/31343C"
                    class="img-round"
                    alt=""
                />
                s/{data.subs.fullPath}
            </div>
            <div class="df">
                <button
                    on:click={() =>
                        goto(
                            toAbsolutePath(
                                data.subs?.isBuiltin ? "../_/tree" : "_/tree",
                            ),
                        )}
                    class="btn-margin">Tree view</button
                >
                <button
                    on:click={() =>
                        goto(
                            toAbsolutePath(
                                data.subs?.isBuiltin
                                    ? "../_/manage"
                                    : "_/manage",
                            ),
                        )}
                    class="btn-margin">Edit</button
                >
                <button
                    on:click={() =>
                        goto(
                            toAbsolutePath(
                                data.subs?.isBuiltin
                                    ? "../_/delete"
                                    : "_/delete",
                            ),
                        )}
                    class="danger btn-margin">Delete</button
                >
            </div>
        </header>
        {data.subs.description}
        {#if !data.subs.isBuiltin}
            <hr />
            <SubList showAddButton={true} subs={data.childs} />
        {/if}
    </article>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub {data.full} not found</h2>
{/if}

<style>
    .danger {
        background-color: var(--danger-color);
        border: var(--danger-color);
        padding: 10px 15px;
    }

    .btn-margin {
        margin-right: 20px;
    }
</style>
