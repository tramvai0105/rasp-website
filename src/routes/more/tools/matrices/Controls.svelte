<script>
    // @ts-nocheck

    export let ctrls;
    export let dims;

    let infoShow = false;
    let emptyArray = [...Array(5).fill("")];
    // let cmdValues = ["r", "2", "t", "c", "2"];
    let cmdValues = [...emptyArray];
    let cmdInputs = [];
    let mult = 1;

    function handleInput(e, i) {
        const value = e.target.value;

        // Автопереход при вводе
        if (value && i < cmdInputs.length - 1) {
            cmdInputs[i + 1].focus();
        }
    }

    function handleKeydown(e, i) {
        if (e.key === "Backspace" && !cmdValues[i] && i > 0) {
            cmdInputs[i - 1]?.focus();
        }
        if (e.key === "Enter" && cmdValues.filter((v) => v != "").length === 5) {
            console.log(1)
            move();
        }
    }
    function move() {
        ctrls.move(cmdValues.join(""));
        cmdValues = [...emptyArray];
        console.log(emptyArray)
        if (cmdInputs[0]) {
            cmdInputs[0].focus();
        }
    }
</script>

<div class="flex flex-row gap-2 items-center">
    <button class="text-sm px-4 border-black hover:border-amber-400 border-[1px] rounded-lg h-fit" on:click={()=>ctrls.newMatrice()}>Создать</button>
    <button class="text-sm px-4 border-black hover:border-amber-400 border-[1px] rounded-lg h-fit" on:click={()=>ctrls.delMatrice()}>Удалить текущую</button>
    <div class="flex flex-col items-center">
        <span class="mb-1">Строки({dims.r})</span>
        <button
            on:click={() => ctrls.addRow()}
            class="px-2 pt-1 w-8 font-semibold bg-green-300 hover:bg-white rounded-t-lg border-black border-x-[1px] border-t-[1px]"
            >+</button
        >
        <button
            on:click={() => ctrls.delRow()}
            class="px-2 pb-1 w-8 font-semibold bg-red-300 hover:bg-white rounded-b-lg border-black border-x-[1px] border-b-[1px]"
            >-</button
        >
    </div>
    <div class="flex flex-col items-center">
        <span class="mb-1">Колонки({dims.c})</span>
        <button
            on:click={() => ctrls.addCol()}
            class="px-2 pt-1 w-8 font-semibold bg-green-300 hover:bg-white rounded-t-lg border-black border-x-[1px] border-t-[1px]"
            >+</button
        >
        <button
            on:click={() => ctrls.delCol()}
            class="px-2 pb-1 w-8 font-semibold bg-red-300 hover:bg-white rounded-b-lg border-black border-x-[1px] border-b-[1px]"
            >-</button
        >
    </div>
    <div class="flex mt-auto flex-col justify-center">
        <button
            on:click={() => (infoShow = true)}
            class="text-gray-500 underline">info</button
        >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            on:click={(e) => {
                infoShow = false;
            }}
            class:show={infoShow}
            class="absolute info-box z-10 items-center cursor-pointer justify-center top-0 left-0 bottom-0 right-0 bg-black/50"
        >
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                on:click={(e) => e.stopPropagation()}
                class="p-10 flex cursor-default flex-col bg-white z-20"
            >
                <span class="font-semibold">Ячейки</span>
                <ol class="list-decimal">
                    <li>
                        Тип <span class="font-semibold px-1">c</span
                        >(колонка)/<span class="font-semibold px-1">r</span
                        >(ряд)
                    </li>
                    <li>Номер колонки/ряда</li>
                    <li>Команда</li>
                    <li>
                        Тип <span class="font-semibold px-1">c</span
                        >(колонка)/<span class="font-semibold px-1">r</span
                        >(ряд)
                    </li>
                    <li>Номер колонки/ряда</li>
                </ol>
                <span class="font-semibold">Команды</span>
                <ol>
                    <li>
                        <span class="font-semibold px-1">s</span> - поменять местами,
                        только для одного типа (колонки или ряды) (c1sc2)
                    </li>
                    <li>
                        <span class="font-semibold px-1">t</span> - вставить из первого
                        места во второе, для любых типов (c1tr2)
                    </li>
                    <li class="whitespace-pre">
                        <span class="font-semibold px-1">m/d</span> -   {`умножение деление, на множитель, второй член не нужен, деление
только целочисленое (c1m__)`}
                    </li>
                </ol>
            </div>
        </div>
        <div class="flex flex-row gap-1">
            {#each Array(5) as v, i}
                <input
                    bind:value={cmdValues[i]}
                    bind:this={cmdInputs[i]}
                    type="text"
                    maxlength="1"
                    on:input={(e) => handleInput(e, i)}
                    on:keydown={(e) => handleKeydown(e, i)}
                    class="border-[1px] text-sm pl-1 h-6 border-black rounded-md w-[20px]"
                />
            {/each}
        </div>
        <button class="border-t-[1px] border-black mt-1" on:click={() => move()}
            >Выполнить</button
        >
    </div>
    <div class="flex flex-col gap-1 h-fit my-auto">
        <span class="text-sm">Множитель</span>
        <input class="border-[1px] text-sm pl-1 h-6 border-black rounded-md w-[75px]" bind:value={mult} on:change={(e)=>ctrls.setMult(Number(e.target.value))}/>
        <span></span>
    </div>
</div>

<style>
    .info-box {
        display: none;
    }

    .info-box.show {
        display: flex;
    }
</style>
