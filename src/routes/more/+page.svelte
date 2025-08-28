<script>
    import ToolsList from "./ui/ToolsList.svelte";

    const title = "More page";

    let { data } = $props();
    const tools = [
        {
            goto: "/matrices",
            name: "Матрицы",
            desc: "Калькулятор матриц. Свойства матриц.",
        },
    ];
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#if data.valid}
    <div class="flex justify-center mt-12">
        <div class="w-[80%]">
        <ToolsList list={tools} />
        </div>
    </div>
{:else}
    <div
        class="w-full h-[50vh] flex flex-row text-lg items-center justify-center whitespace-pre"
    >
        {`Ещё ещё нет`}
    </div>
{/if}
