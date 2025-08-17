<script>
    import NavButton from "./NavButton.svelte";
    import clsx from "clsx";
    import ProjectsList from "./ProjectsList.svelte";
    import { page } from '$app/state';
    let vineDim = 12;

    let navPages = [{ to: "/more", name: "ЕЩЁ" }];
    let projList = false;

    function closeProjectsList() {
        projList = false;
    }
    function openProjectsList() {
        projList = true;
    }
</script>

<nav class="flex flex-row items-end gap-2">
    <ProjectsList open={projList} onClose={closeProjectsList} />
    <div class="flex h-[18px] flex-row gap-2 items-center">
        <a class="font-semibold text-[14px]" href="/">
            <div
                class={clsx(
                    { "text-rasp-400 font-bold": page.url.pathname === '/' },
                    "hover:font-normal hover:text-rasp-400",
                )}
            >
                {"ГЛАВНАЯ"}
            </div>
        </a>
        <div
            class="w-[6px] h-[6px] select-none flex items-center justify-center"
        >
            <div class="w-[4px] h-[4px] bg-green-500 rotate-45"></div>
        </div>
        <button on:click={openProjectsList} class="font-semibold text-[14px]">
            <div
                class={clsx(
                    { "text-rasp-400 font-bold": false },
                    "hover:font-normal hover:text-rasp-400",
                )}
            >
                {"ПРОЕКТЫ"}
            </div>
        </button>
        <div
            class="w-[6px] h-[6px] select-none flex items-center justify-center"
        >
            <div class="w-[4px] h-[4px] bg-green-500 rotate-45"></div>
        </div>
    </div>
    {#each navPages as navPage}
        <div class="flex h-[18px] flex-row gap-2 items-center">
            <NavButton to={navPage.to} name={navPage.name} />
            <div
                class="w-[6px] h-[6px] select-none flex items-center justify-center"
            >
                <div class="w-[4px] h-[4px] bg-green-500 rotate-45"></div>
            </div>
        </div>
    {/each}
</nav>
