<script>
    import { deviceType } from "./stores/device";
    import Wave from "./wave/Wave.svelte";
    import WaveVert from "./wave/WaveVert.svelte";

    let isOpen = true;
    let sliderValue = 15;
    let maxV = 25;
</script>

{#if $deviceType == "desktop"}
    <div
        class="w-full min-h-[50vh] flex flex-col gap-2 items-center justify-center overflow-hidden"
    >
        <div class="flex items-center gap-2">
            пока на главной ничего нет кроме <span
                class="text-green-600 font-bold">гусеницы</span
            ><input
                bind:value={sliderValue}
                class="acc accent-green-400 range"
                type="range"
                min="5"
                max={maxV}
                step="1"
            />
        </div>
        {#key sliderValue}
            <Wave
                sW={sliderValue}
                pointsQ={sliderValue == 1
                    ? 200
                    : Math.floor(maxV * 3 - sliderValue * 1.5 + 1)}
                stroke="green"
            />
        {/key}
    </div>
{:else}
    <div
        class="w-full mt-[50%] flex flex-col gap-8 items-center justify-center overflow-hidden"
    >
        <div class="flex flex-col justify-center items-center gap-2">
            пока на главной ничего нет кроме
            <span class="text-green-600 font-bold">гусеницы</span><input
                bind:value={sliderValue}
                class="acc accent-green-400 range"
                type="range"
                min="5"
                max={maxV}
                step="1"
            />
        </div>
        <div class="h-[90px]">
            {#key sliderValue}
                <Wave
                    sW={sliderValue}
                    pointsQ={sliderValue == 1
                        ? 200
                        : Math.floor(maxV * 3 - sliderValue * 1.5 + 1)}
                    stroke="green"
                />
            {/key}
        </div>
    </div>
{/if}
