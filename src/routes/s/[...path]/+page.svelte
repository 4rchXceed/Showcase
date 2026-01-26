<script lang="ts">
    import type { Sub } from "$lib/types/db/sub";
    import type { SubHomepageData } from "$lib/types/sub_homepage";

    export let data: SubHomepageData;
</script>

{#if data.subs}
    <h1>ShowCase - {data.full}</h1>
    <article class="overflowtxt hover-card-anim">
        <header>
            <img
                src="https://placehold.co/50x50/EEE/31343C"
                class="img-round"
                alt=""
            />
            {data.subs.name}
        </header>
        {data.subs.description}
    </article>
{:else}
    <h1>404: Not Found</h1>
    <h2>Sub {data.full} not found</h2>
{/if}
