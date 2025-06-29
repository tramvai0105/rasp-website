<script lang="ts">
	import Footer from "$lib/layout/footer/Footer.svelte";
	import Header from "$lib/layout/header/Header.svelte";
	import "../app.css";
	import { page } from "$app/state";

	let { children } = $props();
</script>

<svelte:head>
	<title>MySillySite</title>
</svelte:head>

<div class="flex flex-col w-full min-h-[100vh]">
	<Header />
	{@render children()}
</div>
<Footer />
