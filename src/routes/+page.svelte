<script lang="ts">
    import type { HomepageData } from "$lib/types/homepage";

    export let data: HomepageData;
    const subs = data.subs;
</script>

<h1>ShowCase</h1>
<h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>

<h4>Well-known posts</h4>
<div class="grid scrollable-vert">
    {#each subs as sub}
        <article class="overflowtxt hover-card-anim">
            <img
                src="https://placehold.co/50x50/EEE/31343C"
                class="img-round"
                alt=""
            />
            /s/{sub.name}: {sub.description}
        </article>
    {/each}
</div>

<style>
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
