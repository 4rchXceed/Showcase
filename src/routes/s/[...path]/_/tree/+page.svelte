<script lang="ts">
    import type { Sub } from "$lib/utils/types/db/sub";
    import type { TreeViewPageData } from "$lib/utils/types/tree";
    import { onMount } from "svelte";
    import treeMaker from "$lib/external/treeMaker";
    import { goto } from "$app/navigation";
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import SubList from "$lib/components/SubList.svelte";

    export let data: TreeViewPageData;
    console.log(data);

    // Make a treemaker compatible format

    let i = 1;
    const params: { [id: string]: object } = {
        key_1: { trad: data.tree?.name },
    };
    const links: { [id: string]: Sub } = {};

    function addToGraph(treeElement: Sub): { [id: string]: object } {
        const current: { [id: string]: object } = {};
        if (treeElement.subs) {
            for (const treeSubElement of treeElement.subs) {
                i++;
                params["key_" + i] = { trad: treeSubElement.name };
                links["card_key_" + i] = treeSubElement;
                current["key_" + i] = addToGraph(treeSubElement);
            }
        }
        return current;
    }

    if (data.tree) {
        const tree = { key_1: addToGraph(data.tree) };

        onMount(() => {
            treeMaker(tree, {
                id: "tree",
                card_click: async function (element: HTMLElement) {
                    if (links[element.id]) {
                        console.log(links[element.id]);

                        location.href = "/s/" + links[element.id].fullPath;
                    }
                },
                treeParams: params,
                link_width: "4px",
                link_color: "#ff5259",
            });
        });
    }
</script>

<svelte:head>
    <title>Sub s/{data.full} tree view - Showcase</title>
</svelte:head>

{#if data.tree}
    <!-- {#snippet treePart(subTree: Sub)}
        <div class="container-rel">
            <p>
                {subTree.name}
            </p>
            {#if subTree.subs && subTree.subs.length > 0}
                <div class="line"></div>
            {/if}
            <div class="df">
                {#each subTree.subs as sub, i}
                    <div class="db">
                        {@render treePart(sub)}
                    </div>
                {/each}
            </div>
        </div>
    {/snippet}
    <div class="db">
        {@render treePart(data.tree)}
    </div> -->

    <h1>ShowCase - s/{data.full}</h1>
    <!-- Back Button -->
    <a href={"../../"}>Back</a>
    <article class="overflowtxt hover-card-anim">
        <header class="df">
            <div>
                <img
                    src="https://placehold.co/50x50/EEE/31343C"
                    class="img-round"
                    alt=""
                />
                s/{data.full}
            </div>
            <div class="df">
                <button
                    on:click={() => goto(toAbsolutePath("../_/manage"))}
                    class="btn-margin">Edit</button
                >
                <button
                    on:click={() => goto(toAbsolutePath("../_/delete"))}
                    class="danger btn-margin">Delete</button
                >
            </div>
        </header>
        {data.tree.description}
        {#if !data.tree.isBuiltin}
            <hr />
            <SubList showAddButton={true} subs={data.tree.subs ?? []} />
        {/if}
    </article>
    <div id="tree"></div>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub {data.full} not found</h2>
{/if}

<style>
    #tree {
        width: 90vw;

        overflow: scroll;
        position: relative;
        margin-left: auto;
        margin-right: auto;
    }
</style>
