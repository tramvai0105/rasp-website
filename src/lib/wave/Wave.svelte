<script>
    import { onMount } from "svelte";

    export let sW = 20;
    export let pointsQ = 1;
    export let fps = 25;
    export let bgFill = "white";
    export let stroke = "#dc143c";
    export let rot = 0;
    let globalY = sW * 3;
    let offSetX = 0;
    let points = [
        [
            [0, globalY],
            [sW * 10, globalY],
        ],
        [
            [sW * 10, globalY],
            [sW * 20, globalY],
        ],
        [
            [sW * 20, globalY],
            [sW * 30, globalY],
        ],
    ];
    function makePoints() {
        points = [];
        points.push([
            [-sW * 10, globalY],
            [sW * 0, globalY],
        ]);
        for (let i = 0; i < pointsQ; i++) {
            points.push([
                [sW * 0 + sW * i * 10, globalY],
                [sW * 10 + sW * i * 10, globalY],
            ]);
        }
    }

    let t = 0;

    let step = 0.015;

    let dir = step;

    let fullPath = "";

    function updatePaths() {
        const root1 = 0; // Первый корень
        const root2 = sW * 6; // Второй корень
        if (offSetX > sW * 10) {
            offSetX = 0;
            makePoints();
        }
        fullPath = points
            .map((point) => {
                // Линейная интерполяция между root1 и root2
                const y1 = root1 + (root2 - root1) * t;
                const y2 = root2 - (root2 - root1) * t;

                return `M ${point[0][0] + offSetX} ${point[0][1]} C ${globalY + sW * 2 + point[0][0] + offSetX} ${y1} ${globalY + sW * 2 + point[0][0] + offSetX} ${y2} ${point[1][0] + offSetX} ${point[1][1]}`;
            })
            .join(" ");
    }

    let animationId;
    let lastTime = 0;
    const fpsInterval = 1000 / fps; // Интервал между кадрами в ms

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;

        // Пропускаем кадр, если не прошло достаточно времени для нужного FPS
        if (elapsed > fpsInterval) {
            lastTime = timestamp - (elapsed % fpsInterval);

            // Логика анимации
            if (t >= 1) {
                dir = -step;
            }
            if (t <= 0) {
                dir = step;
            }
            t += dir;
            offSetX += 3;
            updatePaths();
        }

        animationId = requestAnimationFrame(animate);
    }

    onMount(() => {
        makePoints();
        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId); // Очистка при демонтировании
        };
    });
</script>

<svg rotate={rot} width={(points.length - 1) * sW * 10 - 10} height={globalY}>
    <g transform={`translate(-5 ${-(globalY / 2)})`}>
        <path d={fullPath} {stroke} stroke-width={sW} fill="none" />
    </g>
    <g transform={`translate(-5 ${-(globalY / 2 - sW)})`}>
        <path d={fullPath} stroke={bgFill} stroke-width={sW} fill="none" />
    </g>
    <g transform={`translate(-5 ${sW / 2 - 2})`}>
        <path d={fullPath} stroke={bgFill} stroke-width={sW} fill="none" />
    </g>
</svg>
