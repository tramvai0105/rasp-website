<script>
    import { onMount } from "svelte";

    let maxIndex = 8;
    let index = maxIndex;
    let fps = 2;

    let gray = (i) => Math.floor(10 + (200 / 14) * i)

    onMount(()=>{
        setInterval(()=>{
            if(index < 0){
                index = maxIndex;
            }
            index--
        },1000/fps)
    })
</script>

<div class="text-xl">
    <div class="relative">
        {#each new Array(maxIndex - 1).fill(1).map((v, i) => i) as i}
            <div
                style={`transform: translateY(-${14 * (i+1)}px); 
                color: ${index == i + 1
                ?"#f14763"
                :`rgb(${gray(i)}, ${gray(i)}, ${gray(i)}`}`}
                class="absolute h-[20px] select-none text-[20x]"
            >
                ПРОЕКТЫ
            </div>
        {/each}
    </div>
    <div style={`color: ${index == 0?"#dc143c":"black"}`} class="font-bold text-[20x]">ПРОЕКТЫ</div>
</div>
