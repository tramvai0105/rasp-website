<script>
    // @ts-nocheck

    import Controls from "./Controls.svelte";
    import Matrice from "./Matrices";
    import MatriceTable from "./MatriceTable.svelte";

    let rows = 3;
    let cols = 3;

    let index = 0;
    let matrices = [new Matrice(rows, cols)];
    let matrice = matrices[index];
    let det = matrice.getDet();
    let matData = matrice.getM();
    let multi = 1

    function changeValue(i, j, v) {
        if (isNaN(v)) {
            v = 0;
        }
        v = Math.floor(v);
        matrice.set(i, j, v);
        matData = matrice.getM();
        det = matrice.getDet();
    }

    function choose(i) {
        index = i;
        matrice = matrices[i];
    }

    $: {
        if (matrices[index]) {
            let _m = matrices[index];
            let newM = new Matrice(rows, cols, null, _m.matrice);
            matrices[index] = newM;
            matrice = matrices[index];
            det = matrice.getDet();
            matData = matrice.getM();
        }
    }

    const ctrls = {
        addRow() {
            if (rows < 7) rows += 1;
        },
        delRow() {
            if (rows > 1) rows -= 1;
        },
        addCol() {
            if (cols < 7) cols += 1;
        },
        delCol() {
            if (cols > 1) cols -= 1;
        },
        newMatrice() {
            matrices.push(new Matrice(3, 3));
            choose(matrices.length - 1);
        },
        delMatrice() {
            if (matrices.length > 1)
                matrices = matrices.filter((v, i) => i != index);
            choose(0);
        },
        setMult(m){
            if(isNaN(m)){
                return
            }
            multi = m;
        },
        move(cmd) {
            let notFullCodes = ["m", "d"]
            let code = cmd.slice(2, 3).toLowerCase();
            if (cmd.length != 5 && !notFullCodes.includes(code)) {
                return;
            }
            let ops = [
                {
                    type: cmd.slice(0, 1).toLowerCase(),
                    index: Number(cmd.slice(1, 2)),
                },
                {
                    type: cmd.slice(3, 4).toLowerCase(),
                    index: Number(cmd.slice(4, 5)),
                },
            ];
            console.log(ops);
            switch (code) {
                case "s":
                    if (ops[0].type == ops[1].type) {
                        if (ops[1].type == "c") {
                            console.log(1);
                            matrice = matrice.swapC(
                                ops[0].index - 1 || 0,
                                ops[1].index - 1 || 0,
                            );
                        }
                        if (ops[1].type == "r") {
                            console.log(1);
                            matrice = matrice.swapR(
                                ops[0].index - 1 || 0,
                                ops[1].index - 1 || 0,
                            );
                        }
                    }
                    break;
                case "t":
                    matrice = matrice.copy(
                        ops[0].type, // source type
                        ops[0].index - 1, // source index
                        ops[1].type, // dest type
                        ops[1].index - 1, // dest index
                    );
                    break;
                case "m":
                    if (ops[0].type == "c") {
                        matrice = matrice.multC(ops[0].index, multi);
                    }
                    if (ops[0].type == "r") {
                        matrice = matrice.multR(ops[0].index, multi);
                    }
                    break;
                case "d":
                    if (ops[0].type == "c") {
                        matrice = matrice.divideC(ops[0].index, multi);
                    }
                    if (ops[0].type == "r") {
                        matrice = matrice.divideR(ops[0].index, multi);
                    }
                    break;
            }
            matData = matrice.getM();
            det = matrice.getDet();
        },
    };
</script>

<div class="w-full flex gap-4 items-center flex-col">
    <span>Выбрана матрица №{index + 1}</span>
    <Controls {ctrls} dims={{ r: rows, c: cols }} />
    <!-- {JSON.stringify(matData)} -->
    <span>Определитель: {typeof det == "number" ? det : "не существует"}</span>
    <div class="flex flex-wrap gap-4">
        {#each matrices as m, i}
            <MatriceTable
                change={changeValue}
                {choose}
                choosen={i == index}
                {i}
                matrice={m}
                rows={m.getR()}
                cols={m.getC()}
            />
        {/each}
    </div>
</div>
