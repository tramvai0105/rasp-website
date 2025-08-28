<script>
    export let list;

    import { page } from "$app/state";

    $: currentPath = page.url.pathname;
</script>

<div class="flex w-full h-full flex-col gap-2">
    {#each list as tool}
    <div class="gap-2 flex flex-col">
        <a href={currentPath + "/tools" + tool.goto} class="flex flex-col gap-2 p-2">
            <span class="font-semibold">{tool.name}</span>
            <span>{tool.desc}</span>
        </a>
        <div class="w-full h-[1px] bg-black"></div>
    </div>
    {/each}
</div>
