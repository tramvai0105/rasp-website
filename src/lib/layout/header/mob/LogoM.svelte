<script>
    export let valid;

    let dim = 48;
</script>

<a href="/">
    <img
        alt="logo"
        width={dim}
        height={dim}
        class={`h-[${dim}px] ${valid?"rotate-180":""} mt-2 ml-2 w-[${dim}px]`}
        src="/images/raspberry-icon.png"
    />
</a>