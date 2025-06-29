<script>
    let colors = ["#f94144", "#f9c74f", "#90be6d", "#277da1",];
    export let selectedColor = "#f94144";
    export let setColor;

    export let bruh = (new Array(9)).fill(false);
    bruh[0] = true;
    export let setBruh;
    let bruhDim = 3;
</script>

<div class="flex mt-6 pl-6 flex-col gap-4 w-[25%]">
    <slot></slot>
    <div class="flex flex-col gap-2">
        <div class="text-sm text-gray-700 flex flex-row gap-4 items-center">Выбор цвета
            <div class="relative group">
                <div class="bg-gray-700 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center">i</div>
                <div 
                class="hidden group-hover:block absolute -translate-y-[100%] bg-gray-700 text-white p-1 rounded-md">
                {`Черный цвет обозначает не горящий
на матрице диод`}</div>
            </div>
        </div>
        <div class="w-[220px] relative flex flex-col justify-center">
            <div
                class="w-[220px] h-fit items-center flex rounded-sm overflow-hidden flex-row"
            >
                {#each colors as color}
                    <button
                        aria-label={`choose color ${color}`}
                        on:click={() => setColor(color)}
                        style={`background-color: ${color}; width: 
        ${
            color == selectedColor
                ? (220 / (colors.length + 1)) * 2
                : 220 / (colors.length + 1)
        }px`}
                        class="h-[16px] flex items-center justify-center text-white transition-all duration-500 group"
                    >
                    </button>
                {/each}
            </div>
            <div
                style={`left: ${colors.indexOf(selectedColor) * (220 / (colors.length + 1))}px; top: 18px; width: ${(220 / (colors.length + 1)) * 2}px`}
                class="h-[6px] absolute border-b-[3px] transition-all duration-500 rounded-b-sm border-x-[2px] border-green-400"
            ></div>
        </div>
    </div>
    <div class="w-[240px] h-[1px] bg-gray-400"></div>
    <div class="flex flex-col gap-2">
        <div class="text-sm text-gray-700 flex flex-row gap-4 items-center">Сделать кисть
            <div class="relative group">
                <div class="bg-gray-700 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center">i</div>
                <div 
                class="hidden group-hover:block absolute -translate-y-[100%] bg-gray-700 text-white p-1 rounded-md">
                {`Верхний левый угол соответствует
нажатию курсора`}</div>
            </div>
        </div>
        <div
            class="p-2 border-[2px] border-black/65 flex flex-col gap-1 rounded-xl bg-gray-100/20 w-fit"
        >
            {#each new Array(bruhDim) as v, i}
                <div class="flex flex-row gap-1">
                    {#each new Array(bruhDim) as vv, j}
                        <div
                            on:click={()=>setBruh(bruhDim * i + j)}
                            class="w-[25px] h-[25px] rounded-md transition-all duration-100 hover:scale-105 hover:z-10 hover:shadow-lg cursor-pointer"
                            style={`
                            background-color: ${bruh[bruhDim * i + j]?selectedColor:"#fff"};
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
</div>
