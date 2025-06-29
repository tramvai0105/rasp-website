<script>
    import { onMount } from "svelte";

    const canvasWidth = 460;
    const canvasHeight = 460;
    const gridSize = 16;
    const w = 16;
    const h = 16;
    const gap = 2; // gap между ячейками

    /**
     * @type {HTMLCanvasElement}
     */
    let canvas;
    /**
     * @type {{ createShader: (arg0: any) => any; VERTEX_SHADER: any; shaderSource: (arg0: any, arg1: string) => void; compileShader: (arg0: any) => void; FRAGMENT_SHADER: any; createProgram: () => any; attachShader: (arg0: any, arg1: any) => void; linkProgram: (arg0: any) => void; useProgram: (arg0: any) => void; createBuffer: () => any; bindBuffer: (arg0: any, arg1: any) => void; ARRAY_BUFFER: any; bufferData: (arg0: any, arg1: Float32Array<ArrayBuffer>, arg2: any) => void; STATIC_DRAW: any; getAttribLocation: (arg0: any, arg1: string) => any; enableVertexAttribArray: (arg0: any) => void; vertexAttribPointer: (arg0: any, arg1: number, arg2: any, arg3: boolean, arg4: number, arg5: number) => void; FLOAT: any; createTexture: () => any; bindTexture: (arg0: any, arg1: any) => void; TEXTURE_2D: any; texParameteri: (arg0: any, arg1: any, arg2: any) => void; TEXTURE_MIN_FILTER: any; NEAREST: any; TEXTURE_MAG_FILTER: any; TEXTURE_WRAP_S: any; CLAMP_TO_EDGE: any; TEXTURE_WRAP_T: any; getUniformLocation: (arg0: any, arg1: string) => any; uniform2f: (arg0: any, arg1: number, arg2: number) => void; uniform1f: (arg0: any, arg1: number) => void; texImage2D: (arg0: any, arg1: number, arg2: any, arg3: number, arg4: number, arg5: number, arg6: any, arg7: any, arg8: Uint8Array<ArrayBuffer>) => void; RGB: any; UNSIGNED_BYTE: any; viewport: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clearColor: (arg0: number, arg1: number, arg2: number, arg3: number) => void; clear: (arg0: any) => void; COLOR_BUFFER_BIT: any; drawArrays: (arg0: any, arg1: number, arg2: number) => void; TRIANGLE_STRIP: any; }}
     */
    let gl;
    let program;
    /**
     * @type {any}
     */
    let texture;
    let positionBuffer;

    export let cells = new Array(w * h).fill("#ffffff");
    let colorsGrid = new Uint8Array(gridSize * gridSize * 3);

    onMount(() => {
        initWebGL();
        colorsGrid = colorsToUint8Array(cells);
        draw();
    });

    $: {
        colorsGrid = colorsToUint8Array(cells);
        if (gl) {
            updateTexture();
            draw();
        }
    }

    function initWebGL() {
    gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported");
        return;
    }

    // Вершинный шейдер
    const vsSource = `
        attribute vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;

    // Фрагментный шейдер с градиентом в промежутках
    const fsSource = `precision highp float;
uniform sampler2D uTexture;
uniform vec2 uCanvasSize;
uniform vec2 uGridSize;
uniform float uGap;

void main() {
    // Размер ячейки с учетом gap
    vec2 cellSize = (uCanvasSize - (uGridSize - 1.0) * uGap) / uGridSize;
    
    // Инвертируем Y-координату
    float yPos = uCanvasSize.y - gl_FragCoord.y;
    vec2 fragPos = vec2(gl_FragCoord.x, yPos);
    
    // Позиция ячейки в сетке
    vec2 gridPos = floor(fragPos / (cellSize + uGap));
    
    // Проверка на выход за границы
    if (gridPos.x >= uGridSize.x || gridPos.y >= uGridSize.y) {
        discard;
    }
    
    // Позиция внутри ячейки (с учетом промежутков)
    vec2 pixelInCell = mod(fragPos, cellSize + uGap);
    
    // Если мы в пределах ячейки - просто отображаем текстуру
    if (pixelInCell.x <= cellSize.x && pixelInCell.y <= cellSize.y) {
        vec2 texCoord = (gridPos + 0.5) / uGridSize;
        gl_FragColor = texture2D(uTexture, texCoord);
        return;
    }
    
    // Определяем, в каком промежутке мы находимся (горизонтальном или вертикальном)
    bool inHorizontalGap = pixelInCell.y > cellSize.y;
    bool inVerticalGap = pixelInCell.x > cellSize.x;
    
    // Координаты соседних ячеек
    vec2 neighbor1Pos = gridPos;
    vec2 neighbor2Pos = gridPos;
    
    if (inHorizontalGap) {
        neighbor2Pos.y += 1.0;
        // Нормализованная позиция в промежутке (0..1)
        float mixFactor = (pixelInCell.y - cellSize.y) / uGap;
        // Берем цвет из обеих ячеек и смешиваем
        vec2 texCoord1 = (neighbor1Pos + 0.5) / uGridSize;
        vec2 texCoord2 = (neighbor2Pos + 0.5) / uGridSize;
        vec4 color1 = texture2D(uTexture, texCoord1);
        vec4 color2 = texture2D(uTexture, texCoord2);
        gl_FragColor = mix(color1, color2, mixFactor);
    } 
    else if (inVerticalGap) {
        neighbor2Pos.x += 1.0;
        // Нормализованная позиция в промежутке (0..1)
        float mixFactor = (pixelInCell.x - cellSize.x) / uGap;
        // Берем цвет из обеих ячеек и смешиваем
        vec2 texCoord1 = (neighbor1Pos + 0.5) / uGridSize;
        vec2 texCoord2 = (neighbor2Pos + 0.5) / uGridSize;
        vec4 color1 = texture2D(uTexture, texCoord1);
        vec4 color2 = texture2D(uTexture, texCoord2);
        gl_FragColor = mix(color1, color2, mixFactor);
    }
    
    // Если мы в углу (пересечение горизонтального и вертикального промежутков)
    if (inHorizontalGap && inVerticalGap) {
        vec2 neighbor3Pos = vec2(gridPos.x + 1.0, gridPos.y);
        vec2 neighbor4Pos = vec2(gridPos.x, gridPos.y + 1.0);
        vec2 neighbor5Pos = vec2(gridPos.x + 1.0, gridPos.y + 1.0);
        
        vec2 texCoord3 = (neighbor3Pos + 0.5) / uGridSize;
        vec2 texCoord4 = (neighbor4Pos + 0.5) / uGridSize;
        vec2 texCoord5 = (neighbor5Pos + 0.5) / uGridSize;
        
        vec4 color3 = texture2D(uTexture, texCoord3);
        vec4 color4 = texture2D(uTexture, texCoord4);
        vec4 color5 = texture2D(uTexture, texCoord5);
        
        // Нормализованные позиции в промежутках
        float mixFactorX = (pixelInCell.x - cellSize.x) / uGap;
        float mixFactorY = (pixelInCell.y - cellSize.y) / uGap;
        
        // Смешиваем все 4 соседних цвета с учетом позиции в углу
        vec4 colorTop = mix(gl_FragColor, color5, mixFactorX);
        vec4 colorBottom = mix(color4, color3, mixFactorX);
        gl_FragColor = mix(colorBottom, colorTop, mixFactorY);
    }
}`;

    // Компиляция шейдеров
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    // Проверка компиляции шейдеров
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
    }
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
    }

    // Создание программы
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Вершины для полноэкранного квада
    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

    // Создание буфера вершин
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW,
    );

    // Установка атрибутов
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Создание текстуры
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Установка uniform-переменных
    const canvasSizeLocation = gl.getUniformLocation(program, "uCanvasSize");
    gl.uniform2f(canvasSizeLocation, canvas.width, canvas.height);

    const gridSizeLocation = gl.getUniformLocation(program, "uGridSize");
    gl.uniform2f(gridSizeLocation, w, h);

    const gapLocation = gl.getUniformLocation(program, "uGap");
    gl.uniform1f(gapLocation, gap);
}

    function updateTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGB,
            w,
            h,
            0,
            gl.RGB,
            gl.UNSIGNED_BYTE,
            colorsGrid,
        );
    }

    function draw() {
        if (!gl) return;

        gl.viewport(0, 0, canvasWidth, canvasHeight);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function colorsToUint8Array(cells) {
        const out = new Uint8Array(cells.length * 3);
        for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            const r = parseInt(c.slice(1, 3), 16);
            const g = parseInt(c.slice(3, 5), 16);
            const b = parseInt(c.slice(5, 7), 16);
            out[i * 3] = r;
            out[i * 3 + 1] = g;
            out[i * 3 + 2] = b;
        }
        return out;
    }
</script>

<canvas
    bind:this={canvas}
    width={canvasWidth}
    height={canvasHeight}
    style="position: absolute;"
    class="rounded-md"
></canvas>
