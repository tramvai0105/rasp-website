<script>
    import { onMount } from "svelte";

    export let sW = 20;
    export let pointsQ = 1;
    export let fps = 25;
    export let bgFill = "white";
    export let stroke = "#dc143c";
    export let rot = 0;
    export let t = 0;
    let globalX = sW * 3;
    let offSetY = 0;
    let points = [
        [
            [globalX, 0],
            [globalX, sW * 10],
        ],
        [
            [globalX, sW * 10],
            [globalX, sW * 20],
        ],
        [
            [globalX, sW * 20],
            [globalX, sW * 30],
        ],
    ];
    function makePoints() {
        points = [];
        for (let i = 0; i < pointsQ; i++) {
            points.push([
                [globalX, sW * 0 + sW * i * 10],
                [globalX, sW * 10 + sW * i * 10],
            ]);
        }
        points.push([
            [globalX, sW * 0 + sW * pointsQ * 10],
            [globalX, sW * 10 + sW * pointsQ * 10],
        ]);
    }

    let step = 0.015;

    let dir = step;

    let fullPath = "";

    function updatePaths() {
        const root1 = 0; // Первый корень
        const root2 = sW * 6; // Второй корень

        if (offSetY > sW * 10) {
            offSetY = 0;
            makePoints();
        }
        fullPath = points
            .map((point) => {
                // Линейная интерполяция между root1 и root2
                const x1 = root1 + (root2 - root1) * t;
                const x2 = root2 - (root2 - root1) * t;

                return `M ${point[0][0]} ${point[0][1] + offSetY} C ${x1} ${globalX + sW * 2 + point[0][1] + offSetY} ${x2} ${globalX + sW * 2 + point[0][1] + offSetY} ${point[1][0]} ${point[1][1] + offSetY}`;
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
            offSetY += 3;
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

<svg rotate={rot} width={globalX} height={points.length * sW * 10 - 10}>
    <g transform={`translate(${-(globalX / 2)} -5)`}>
        <path d={fullPath} {stroke} stroke-width={sW} fill="none" />
    </g>
    <g transform={`translate(${-(globalX / 2 - sW)} -5)`}>
        <path d={fullPath} stroke={bgFill} stroke-width={sW} fill="none" />
    </g>
    <g transform={`translate(${-(globalX / 2 - sW * 2 + 2)} -5)`}>
        <path d={fullPath} stroke={bgFill} stroke-width={sW} fill="none" />
    </g>
</svg>
