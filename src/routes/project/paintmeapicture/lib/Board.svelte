<script>
    import { onMount, afterUpdate } from "svelte";
    import Canvas from "./Canvas.svelte";

    let w = 16;
    let h = 16;
    export let cells = new Array(w * h).fill("#ffffff");
    export let color = "#f94144";
    export let setCells;
    export let updateId;

    onMount(() => {
    });
</script>

<div class="p-2 border-[2px] h-fit border-black/65 rounded-xl bg-gray-100/20">
    <div
        class="flex flex-col w-[476px] h-[476px] relative gap-1 p-2 rounded-lg"
    >
        <Canvas updateId={updateId} cells={cells}/>
        {#each new Array(w) as _, i}
            <div class="flex flex-row gap-1 z-10">
                {#each new Array(h) as _, j}
                    <div
                        on:click={() => setCells(i, j)}
                        class="w-[25px] opacity-30 h-[25px] rounded-md transition-all duration-100 hover:scale-105 hover:z-10 hover:shadow-lg cursor-pointer"
                        style={`
                            background-color: ${cells[i * h + j]};
                            box-shadow: 
                                1px 1px 2px rgba(0, 0, 0, 0.3),
                                inset 1px 1px 2px rgba(255, 255, 255, 0.2),
                                inset -1px -1px 2px rgba(0, 0, 0, 0.2);
                            border: 1px solid rgba(0, 0, 0, 0.1);
                        `}
                    ></div>
                {/each}
            </div>
        {/each}
    </div>
</div>
