<script lang="ts">
	import Footer from "$lib/layout/footer/Footer.svelte";
	import Header from "$lib/layout/header/Header.svelte";
	import "../app.css";
	import { page } from "$app/state";
	import { deviceType, initDeviceType } from "$lib/stores/device";
	import { onMount } from "svelte";
	import Loading from "$lib/layout/Loading.svelte";

	let { children, data } = $props();

	onMount(() => {
		initDeviceType(data);
	});
</script>

<svelte:head>
	<title>MySillySite</title>
</svelte:head>

{#await $deviceType then type}
	{#if type != "default"}
		<!-- {#if false} -->
		<div class="flex flex-col w-full min-h-[100vh]">
			<Header valid={data.valid} />
			{@render children()}
		</div>
		<Footer />
	{:else}
		<div class="w-full flex items-center justify-center min-h-[90vh]">
			<Loading />
		</div>
	{/if}
{/await}
