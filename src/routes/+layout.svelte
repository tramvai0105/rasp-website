<script lang="ts">
	import Footer from "$lib/layout/footer/Footer.svelte";
	import Header from "$lib/layout/header/Header.svelte";
	import "../app.css";
	import { page } from "$app/state";
    import { deviceType, initDeviceType } from "$lib/stores/device";
    import { onMount } from "svelte";

	let { children, data } = $props();

	onMount(()=>{initDeviceType(data)})
</script>

<svelte:head>
	<title>MySillySite</title>
</svelte:head>

{#if $deviceType != "default"}
<div class="flex flex-col w-full min-h-[100vh]">
	<Header />
	{@render children()}
</div>
<Footer />
{:else}
	<h1>Элвис</h1>
{/if}
