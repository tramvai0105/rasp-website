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

    let textToCopyTg = "@alef_delta";
    let textToCopyMail = "tramvai00105@gmail.com";
    let isCopiedTg = false;
    let isCopiedMail = false;

    async function copyToClipboardTg() {
        try {
            await navigator.clipboard.writeText(textToCopyTg);
            isCopiedTg = true;
            setTimeout(() => (isCopiedTg = false), 2000); // Сброс статуса через 2 секунды
        } catch (err) {
            console.error("Ошибка копирования: ", err);
        }
    }

    async function copyToClipboardMail() {
        try {
            await navigator.clipboard.writeText(textToCopyMail);
            isCopiedMail = true;
            setTimeout(() => (isCopiedMail = false), 2000); // Сброс статуса через 2 секунды
        } catch (err) {
            console.error("Ошибка копирования: ", err);
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
                <div class="bg-white px-4 py-2 w-fit font-semibold">
                    Контакты
                </div>
                <div class="group flex flex-row gap-2">
                    <div class="bg-white px-4 py-2 w-fit">
                        tramvai00105@gmail.com
                    </div>
                    <button
                        on:click={copyToClipboardMail}
                        class="group-hover:translate-0 text-sm px-2 items-center flex group-hover:opacity-100 transition-all delay-150 opacity-0 -translate-x-4 bg-white h-full"
                    >
                        {isCopiedMail ? "Скопировано!" : "Копировать"}
                    </button>
                </div>
                <div class="group flex flex-row gap-2">
                    <div class="bg-white px-4 py-2 w-fit">tg @alef_delta</div>
                    <a
                        sveltekit:prefetch
                        href="https://t.me/alef_delta"
                        class="group-hover:translate-0 px-2 items-center flex group-hover:opacity-100 transition-all opacity-0 -translate-x-4 bg-white h-full"
                    >
                        {"Перейти ->"}
                    </a>
                    <button
                        on:click={copyToClipboardTg}
                        class="group-hover:translate-0 text-sm px-2 items-center flex group-hover:opacity-100 transition-all delay-150 opacity-0 -translate-x-4 bg-white h-full"
                    >
                        {isCopiedTg ? "Скопировано!" : "Копировать"}
                    </button>
                </div>
            </div>
            <div class="flex flex-col gap-4 w-1/2 h-full justify-center">
                <div class="flex flex-row gap-2">
                    <button
                        on:click={() => (showForm = false)}
                        class="bg-white border-[2px] font-semibold border-white hover:border-black px-4 py-2 w-fit"
                        >Резюме</button
                    >
                    <button
                        on:click={() => (showForm = true)}
                        class="bg-white border-[2px] font-semibold border-white hover:border-black px-4 py-2 w-fit"
                        >Форма обратной связи</button
                    >
                </div>
                {#if showForm}
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-row gap-3">
                            <input
                                class="p-2 border-white border-[1px] text-white"
                                bind:value={name}
                                placeholder="Ваше имя"
                            />
                            <button
                                class="p-2 border-white border-[1px] text-white hover:bg-white hover:text-black"
                                >Отправить</button
                            >
                        </div>
                        <textarea
                            class="p-2 border-white border-[1px] h-36 text-white resize-none"
                            bind:value={review}
                            placeholder="Ваше мнение"
                        />
                    </div>
                {:else}
                    <div
                        class="p-14 text-white border-[2px] text-lg font-medium w-fit border-white"
                    >
                        Практикующий в сфере веба, дизайна и интернета вещей
                        разработчик.
                    </div>
                {/if}
            </div>
        </div>
    </div>
</footer>
