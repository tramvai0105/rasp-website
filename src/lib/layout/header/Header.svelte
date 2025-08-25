<script>
    import { deviceType } from "$lib/stores/device";
    import Logo from "./des/Logo.svelte";
    import Navigation from "./des/Navigation.svelte";
    import LogoM from "./mob/LogoM.svelte";
    import NavigationM from "./mob/NavigationM.svelte";
</script>

{#if $deviceType == "desktop"}
<header class="flex flex-row pb-2 pr-2 pt-6 pl-6 gap-6">
    <Logo/>
    <Navigation/>
</header>
{:else}
<header class="flex flex-row justify-between items-center">
    <LogoM/>
    <NavigationM/>
    <div class="mr-2 w-[48px]"></div>
</header>
{/if}

