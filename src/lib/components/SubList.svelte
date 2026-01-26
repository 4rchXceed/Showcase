<script lang="ts">
    import type { Sub } from "$lib/types/db/sub";

    export let subs: Sub[];
</script>

<div class="grid scrollable-vert">
    {#if subs.length > 0}
        {#each subs as sub}
            <article class="overflowtxt hover-card-anim">
                <a
                    href="/s/{sub.fullPath ? sub.fullPath : sub.name}"
                    class="contrast no-underline"
                >
                    <img
                        src="https://placehold.co/50x50/EEE/31343C"
                        class="img-round"
                        alt=""
                    />
                    s/{sub.fullPath ? sub.fullPath : sub.name}: {sub.description}
                </a>
            </article>
        {/each}
    {:else}
        <p>There are no subs to show.</p>
    {/if}
</div>

<style>
    .no-underline {
        text-decoration: none;
    }

    .hover-card-anim {
        transform: translateY(0) scale(1);
        transition: 0.4s;
    }

    .hover-card-anim:hover {
        transform: translateY(-5px) scale(1.01);
    }

    .hover-card-anim:active {
        transform: translateY(-2px) scale(1);
    }

    .overflowtxt {
        width: 25vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 15px;
        cursor: pointer;
    }

    .scrollable-vert {
        width: 100%;
        overflow-y: visible;
        overflow-x: scroll;
    }
</style>
