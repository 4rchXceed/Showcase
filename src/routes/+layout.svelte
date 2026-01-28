<script lang="ts">
	import "@picocss/pico";
	import "$lib/css/general.css";
	import "$lib/css/pico.colors.min.css";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
</svelte:head>

{@render children()}
