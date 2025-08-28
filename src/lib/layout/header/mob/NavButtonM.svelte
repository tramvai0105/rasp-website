<script>
    import { page } from "$app/state";
    import clsx from "clsx";

    export let name;
    export let to;
</script>

<a class="font-semibold text-[16px]" href={to}>
    <div class={clsx({"text-rasp-400 font-bold": page.url.pathname === to}, "hover:font-normal hover:text-rasp-400")}>
        {name.toUpperCase()}   
    </div>
</a>