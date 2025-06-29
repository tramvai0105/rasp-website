<script>
    import { onMount } from "svelte";

    /**
     * @type {HTMLElement}
     */
    let footerButtonEl;
    /**
     * @type {HTMLDivElement}
     */
    let footerBodyEl;
    let repeatCounter = 1;
    let lastScrollY = 0;
    let showForm = false;
    let name = "";
    let review = "";

    function scrollToBody() {
        if (footerBodyEl) {
            footerBodyEl.style.display = "flex";
            window.scrollTo({ top: footerBodyEl.offsetTop });
            lastScrollY = window.scrollY; // Фиксируем позицию скролла при открытии
        }
    }

    onMount(() => {
        if (footerBodyEl) {
            footerBodyEl.style.display = "none";
        }
        if (footerButtonEl) {
            let w = footerButtonEl.clientWidth;
            repeatCounter = Math.floor((w - w * 0.1) / 220);
        }
        window.addEventListener("resize", () => {
            if (footerButtonEl) {
                let w = footerButtonEl.clientWidth;
                repeatCounter = Math.floor((w - w * 0.1) / 220);
            }
        });
        window.addEventListener("scroll", () => {
            if (footerBodyEl && footerBodyEl.style.display === "flex") {
                // Если футер открыт
                const currentScrollY = window.scrollY;

                // Если скроллим вверх (даже на 1px) — закрываем футер
                if (currentScrollY < lastScrollY) {
                    footerBodyEl.style.display = "none";
                }

                lastScrollY = currentScrollY;
            }
        });
    });
</script>

<footer class="h-fit">
    <button
        bind:this={footerButtonEl}
        on:click={scrollToBody}
        class="w-full px-[3%] justify-center gap-4 flex flex-row h-[22px] text-[12px] bg-gradient-to-t from-gray-200 to-white text-gray-500"
    >
        {#each new Array(repeatCounter) as i}
            <div class="gap-4 flex flex-row">
                <div class="bg-emerald-200 hover:scale-110 skew-6">
                    это что?
                </div>
                <div class="bg-pink-200 hover:scale-110 -skew-6">
                    это футер!
                </div>
                <div class="bg-red-200 hover:scale-110 rotate-12 -skew-12">
                    нажми меня!
                </div>
            </div>
        {/each}
    </button>
    <div class="w-full h-[4px] bg-gray-200"></div>
    <div
        bind:this={footerBodyEl}
        class="h-[60vh] flex-col bg-green-800 pt-1 px-[5%]"
    >
        <div class="mx-auto text-sm bg-white px-2">
            просто проскроль наверх!
        </div>
        <div class="flex flex-row h-full">
            <div
                class="flex gap-4 flex-col pl-[15%] w-1/2 h-full justify-center"
            >
                <div class="bg-white px-4 py-2 w-fit font-semibold">Контакты</div>
                <div class="bg-white px-4 py-2 w-fit">
                    tramvai00105@gmail.com
                </div>
                <a
                    href="https://t.me/alef_delta"
                    class="bg-white px-4 py-2 w-fit">tg @alef_delta</a
                >
            </div>
            <div class="flex flex-col gap-4 w-1/2 h-full justify-center">
                <div class="flex flex-row gap-2">
                    <button on:click={()=>showForm=false}
                        class="bg-white border-[2px] font-semibold border-white hover:border-black px-4 py-2 w-fit"
                        >Резюме</button
                    >
                    <button on:click={()=>showForm=true}
                        class="bg-white border-[2px] font-semibold border-white hover:border-black px-4 py-2 w-fit"
                        >Форма обратной связи</button
                    >
                </div>
                {#if showForm}
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-row gap-3">
                            <input class="p-2 border-white border-[1px] text-white" bind:value={name} placeholder="Ваше имя"/>
                            <button class="p-2 border-white border-[1px] text-white hover:bg-white hover:text-black">Отправить</button>
                        </div>
                        <textarea class="p-2 border-white border-[1px] h-36 text-white resize-none" bind:value={review} placeholder="Ваше мнение"/>
                    </div>
                {:else}
                    <div class="p-14 text-white border-[2px] text-lg font-medium w-fit border-white">
                        Практикующий в сфере веба, дизайна и интернета вещей
                        разработчик.
                    </div>
                {/if}
            </div>
        </div>
    </div>
</footer>
