<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "@picocss/pico";
	import "$lib/css/general.css";
	import "$lib/css/pico.colors.min.css";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TODO</title>
</svelte:head>

{@render children()}
