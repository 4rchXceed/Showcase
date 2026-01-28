<script lang="ts">
    import SubList from "$lib/components/SubList.svelte";
    import type { HomepageData } from "$lib/utils/types/homepage";

    export let data: HomepageData;
    const subs = data.subs;
</script>

<svelte:head>
    <title>ShowCase - Home</title>
    <meta name="description" content="TODO: Website 'slogan'." />
</svelte:head>

<h1>ShowCase</h1>
<h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>

<h4>Well-known posts</h4>
<SubList {subs} showAddButton={true} isHomepage={true} />
