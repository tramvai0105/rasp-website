<script>
    import { onMount } from "svelte";
    import Wave from "../../../wave/Wave.svelte";
    import WaveVert from "../../../wave/WaveVert.svelte";
    import clsx from "clsx";
    import { slide } from "svelte/transition";
    import ProjectsVidgetM from "./ProjectsVidgetM.svelte";
    import Name from "./NameM.svelte";
    import { goto } from "$app/navigation";

    /**
     * @type {() => void}
     */
     export let onClose;
    export let open;
    let mounted = false;
    let blockWidth = 1;

    let projects = [
        { name: "PaintMeAPicture", to: "paintmeapicture" },
        { name: "Zhabba", to: "zhabba" },
    ];
    /**
     * @type {HTMLDivElement}
     */
    let blockRef;
    /**
     * @type {HTMLDivElement}
     */
    let rombRef;
    /**
     * @type {HTMLDivElement}
     */
    let wave1Ref;
    /**
     * @type {HTMLDivElement}
     */
    let wave2Ref;

    // function makeRomb() {
    //     if (rombRef && blockRef && wave1Ref && wave2Ref) {
    //         let height = blockRef.clientHeight;
    //         rombRef.style.height = height + "px";
    //         rombRef.style.width = height + "px";
    //         // rombRef.style.left = - (height * 1.4) / 2  + "px"
    //         rombRef.style.left = -(height / 3) + "px";
    //         blockWidth = height;
    //     }
    // }

    function goToProject(to){
        onClose();
        goto(`/project/${to}`);
    }

    onMount(() => {
        // makeRomb();
        // window.addEventListener("resize", makeRomb);
        mounted = true;
        document.addEventListener('touchmove', (e)=>{
            if(open){
                e.preventDefault()
            }
        }, {passive: false});
    });
</script>

<div
    bind:this={blockRef}
    class={clsx("blockEl", { show: open }, { "opacity-0": !mounted })}
>
    <!-- <div class="absolute z-20 rotate-180">
        <WaveVert pointsQ={10}/>
    </div> -->
    <div class="bg-white h-[100vh] w-[85vw] absolute left-0">
        <button
            on:click={onClose}
            class="w-[55px] h-[55px] hover:bg-rasp-400 border-[2px] border-white hover:text-white text-4xl bg-[#dc143c] absolute top-3 right-3
        select-nonez-30 rounded-full flex rotate-45 z-10
        items-center justify-center"
        >
            +</button
        >
        <div class="absolute rotate-180 right-0 translate-x-10">
            <WaveVert fps={35} pointsQ={10}/>
        </div>
    </div>
    <!-- <div class="bg-white absolute"> -->
        <!-- <div
            bind:this={wave1Ref}
            class="w-fit absolute right-0 -translate-y-[40px]"
        >
            <Wave fps={35} pointsQ={10} />
        </div>
        <div
            bind:this={wave2Ref}
            class="w-fit absolute right-0 rotate-180 translate-x-[40px]"
        >
            <WaveVert fps={35} pointsQ={10} />
        </div> -->
        
    <!-- </div> -->
    <div
        class="left-0 h-[100vh] absolute flex flex-row pl-[3%] justify-center gap-3"
    >
        <div class="flex w-[240px] flex-col pt-[90px]">
            <ProjectsVidgetM />
            <div class="flex flex-col gap-1">
                {#each projects as project}
                    <button on:click={()=>goToProject(project.to)}
                        class="px-4 w-fit transiti transition-all duration-300 hover:before:content-['->'] hover:scale-125 hover:translate-x-8 py-1 bg-rasp-400 border-2 border-blue-300 text-white hover:text-rasp-400 hover:bg-white"
                        >{project.name}</button
                    >
                {/each}
            </div>
        </div>
        <!-- {#key blockWidth}
            <Name _width={blockWidth} />
        {/key} -->
    </div>
</div>

<style>
    .blockEl {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        /* overflow: hidden; */
        z-index: 50;

        /* Начальное состояние */
        opacity: 0;
        transform: translateX(-400px);
        transition:
            color 1.3s ease 0.4s,
            opacity 0.4s ease,
            transform 0.8s ease;
        pointer-events: none;
    }

    .blockEl.show {
        background-color: rgb(0, 0, 0, 10%);
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }
</style>
