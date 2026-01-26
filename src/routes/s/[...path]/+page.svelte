<script lang="ts">
    import SubList from "$lib/components/SubList.svelte";
    import type { SubHomepageData } from "$lib/types/sub_homepage";

    export let data: SubHomepageData;
</script>

{#if data.subs}
    <h1>ShowCase - s/{data.full}</h1>
    <!-- Back Button -->
    <a href={"/s/" + data.full.substring(0, data.full.lastIndexOf("/"))}>Back</a
    >
    <article class="overflowtxt hover-card-anim">
        <header>
            <img
                src="https://placehold.co/50x50/EEE/31343C"
                class="img-round"
                alt=""
            />
            s/{data.subs.name}
        </header>
        {data.subs.description}
        <hr />
        <SubList subs={data.childs} />
    </article>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub {data.full} not found</h2>
{/if}
