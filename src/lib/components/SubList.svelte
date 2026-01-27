<script lang="ts">
    import { goto } from "$app/navigation";
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import type { Sub } from "$lib/utils/types/db/sub";

    export let subs: Sub[];
    export let showAddButton = false;
    export let isHomepage = false;
</script>

<div class="df">
    {#if showAddButton}
        <button
            class="btn-nostyle"
            aria-label="Add new"
            on:click={() =>
                goto(toAbsolutePath(isHomepage ? "s/_/new" : "_/new"))}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                class="bi bi-plus-circle b-add"
                viewBox="0 0 16 16"
            >
                <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                />
                <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                />
            </svg>
        </button>
    {/if}
    <div class="df scrollable-vert center-text-vert">
        {#if subs.length > 0}
            {#each subs as sub}
                {#if !sub.isBuiltin}
                    <article class="hover-card-anim center-text-vert">
                        <a
                            href="/s/{sub.fullPath ? sub.fullPath : sub.name}"
                            class="overflowtxt contrast no-underline a-full"
                        >
                            <img
                                src="https://placehold.co/50x50/EEE/31343C"
                                class="img-round"
                                alt=""
                            />
                            s/{sub.fullPath ? sub.fullPath : sub.name}: {sub.description}
                        </a>
                    </article>
                {/if}
            {/each}
        {:else}
            <p>There are no subs to show.</p>
        {/if}
    </div>
</div>
<div class="df scrollable-vert center-text-vert">
    {#if subs.filter((s) => s.isBuiltin).length !== 0}
        <hr />
        <h4 class="center-text-vert">Categories:</h4>
    {/if}
    {#each subs as builtinSub}
        {#if builtinSub.isBuiltin}
            <article class="hover-card-anim center-text-vert">
                <a
                    href="/s/{builtinSub.fullPath
                        ? builtinSub.fullPath
                        : builtinSub.name}"
                    class="overflowtxt contrast no-underline a-full"
                >
                    <img
                        src="https://placehold.co/50x50/EEE/31343C"
                        class="img-round"
                        alt=""
                    />
                    {builtinSub.name}
                </a>
            </article>
        {/if}
    {/each}
</div>

<style>
    .a-full {
        height: 100%;
        width: 100%;
        display: block;
    }

    .b-add {
        color: green;
    }

    .no-underline {
        text-decoration: none;
    }

    .hover-card-anim {
        transform: translateY(0) scale(1);
        transition: 0.4s;
        min-width: 25vw;
        padding: 15px;
    }

    .hover-card-anim:hover {
        transform: translateY(-5px) scale(1.01);
    }

    .hover-card-anim:active {
        transform: translateY(-2px) scale(1);
    }

    .overflowtxt {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .scrollable-vert {
        display: inline-flex;
        width: 100%;
        overflow-y: visible;
        overflow-x: scroll;
    }

    .center-text-vert {
        margin: auto 0;
    }
    .center-text-vert > * {
        margin: auto 0;
    }
</style>
