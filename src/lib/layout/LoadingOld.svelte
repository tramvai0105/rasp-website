<script>
    import { onMount } from "svelte";

    let divs = [];
    let colors = [
        "#fde8eb",
        "#fbd1d8",
        "#f8a3b1",
        "#f4758a",
        "#f14763",
        "#dc143c",
        "#b81032",
    ];
    let index = 0;
    let values = [0, 1, 2, 3];
    const sequence = [0, 1, 3, 2];
    let directions = [1, 1, 1, 1];

    async function animate() {
        await new Promise((res) =>
            setTimeout(() => {
                res(0);
            }, 200),
        );

        const currentIndex = sequence[index];

        if (divs[currentIndex]) {
            values[currentIndex] += directions[currentIndex];

            if (
                values[currentIndex] === colors.length - 1 ||
                values[currentIndex] === 0
            ) {
                directions[currentIndex] *= -1;
            }

            values[currentIndex] = Math.max(
                0,
                Math.min(colors.length - 1, values[currentIndex]),
            );

            divs[currentIndex].style.backgroundColor =
                colors[values[currentIndex]];

            // Пропорциональное изменение масштаба
            const progress = values[currentIndex] / (colors.length - 1); // от 0 до 1
            const minScale = 0.8; // Минимальный масштаб (60% от исходного)
            const scale =
                1 - ((progress * progress) / (2 * minScale)) * (1 - minScale); // Плавное уменьшение

            divs[currentIndex].style.transform = `scale(${scale})`;

            // Для плавности можно добавить transition
            divs[currentIndex].style.transition = "transform 0.2s ease";
        }

        index = (index + 1) % sequence.length;
        requestAnimationFrame(animate);
    }

    onMount(() => {
        requestAnimationFrame(animate);
    });
</script>

<div>
    <div class="grid grid-cols-2 grid-rows-2 gap-2">
        {#each Array(4) as v, i}
            <div
                bind:this={divs[i]}
                style={`background-color: ${colors[i]};`}
                class="w-[72px] h-[72px] transition-all duration-500"
            ></div>
        {/each}
    </div>
    <div class="ml-auto translate-x-30">загружаем...</div>
</div>
