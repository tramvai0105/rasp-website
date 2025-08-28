<script>
// @ts-nocheck
    import clsx from "clsx";
    import { onMount } from "svelte";

    export let matrice;
    export let rows;
    export let cols;
    export let change;
    export let i;
    export let choose;
    export let choosen;
    
    let m = false;
    let localMatrice = {};

    function _change(i, j, v){
        localMatrice[`${i}${j}`] = v;
        change(i, j, v)
    }
    
    $:{
        const originalMatrice = matrice.getM();
        for (let key in originalMatrice) {
            if (originalMatrice.hasOwnProperty(key)) {
                localMatrice[key] = originalMatrice[key];
            }
        }
        m = true;
    }
</script>

<div class={clsx({"border-amber-400 border-[1px]":choosen},"flex rounded-xl p-1 flex-col items-center gap-2")}>
    <span>№{i+1}</span>
    {#if m}
        <div class="flex flex-row gap-2 text-sm">
        <div class="w-10 h-8 p-1 flex items-center opacity-0 justify-center">
            <div class="border-[1px] w-8 pl-3 border-black flex items-center justify-center rounded-lg ">
                {1}
            </div>
        </div>
        {#each Array(cols) as a, i}
            <div class="w-10 h-8 p-1 flex items-center justify-center">
                <div class="border-[1px] w-8 pl-3 border-black flex items-center justify-center rounded-lg ">
                    {i+1}
                </div>
            </div>
        {/each}
        </div>
        <div class="flex flex-col gap-2">
        {#each (new Array(rows)) as v, i}
            <div class="flex flex-row gap-2 relative">
            <div class="w-10 h-8 p-1 flex items-center justify-center">
                <div class="border-[1px] w-8 pl-3 border-black flex items-center justify-center rounded-lg ">
                    {i+1}
                </div>
            </div>
            {#each (new Array(cols)) as v1, j}
                <input value={matrice.get(i, j)} 

                on:change={(e)=>e.target ? _change(i, j, e.target.value) : null} 
                
                class={clsx({"bg-yellow-200" : localMatrice[`${i}${j}`] % 1 > 0 || isNaN(localMatrice[`${i}${j}`])},
                "border-[1px] pl-3 border-black w-10 h-10 p-1 rounded-lg flex items-center justify-center")}/>
            {/each}
            </div>
        {/each}
        </div>
    {/if}
    <button on:click={()=>choose(i)} class="px-4 mx-auto hover:bg-black hover:text-white hover:font-bold border-[1px] border-black rounded-md">Выбрать</button>
</div>