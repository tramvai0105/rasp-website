// @ts-nocheck

class Matrice {

    matrice = {};
    rows = 2;
    cols = 2;

    constructor(rows, cols, vals, obj) {
        if (rows) {
            this.rows = rows;
        }
        if (cols) {
            this.cols = cols;
        }
        let initArray = []
        if (obj) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    let val = obj[`${i}${j}`]
                    if (val) {
                        this.matrice[`${i}${j}`] = val;
                    } else {
                        this.matrice[`${i}${j}`] = 0;
                    }
                }
            }
            return;
        }
        if (vals) {
            initArray = vals.reverse();
        } else { initArray = (new Array(this.rows * this.cols)).fill(0).map((v, i) => i + 1) }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let initVal = `${i + 1}${j + 1}`;
                // let initVal = 1;
                this.matrice[`${i}${j}`] = initArray.pop();
            }
        }
    }

    getDet() {
        let det = this.calcDet(this);
        return det;
    }

    getMinorMat(i, j) {
        let minor = this.calcMinorMat(i, j, this);
        return minor;
    }

    calcDet(obj) {
        if (typeof obj === "number") {
            return obj;
        }

        if (obj.rows === 1 && obj.cols === 1) {
            return obj.matrice["00"] || obj.matrice[0] || 0;
        }

        let mat = obj.matrice

        if (obj.rows != obj.cols) {
            return false;
        }

        if (this.rows == 2) {
            return mat["00"] * mat["11"] - mat["01"] * mat["10"];
        } else {
            let d = 0;
            for (let i = 0; i < obj.rows; i++) {
                const minor = this.calcMinorMat(i, 0, obj);
                const algAd = this.calcAlgAd(i, 0, minor);
                d += obj.matrice[`${i}0`] * algAd;
            }
            return d;
        }
    }

    calcAlgAd(i, j, minor) {
        let one = (i + j % 2) > 0 ? -1 : 1
        return one * this.calcDet(minor);
    }

    calcMinorMat(I, J, obj) {
        let mat = obj.matrice;
        let newMat = [];
        for (let i = 0; i < obj.rows; i++) {
            for (let j = 0; j < obj.cols; j++) {
                if (i != I && j != J) {
                    newMat.push(mat[`${i}${j}`]);
                }
            }
        }
        return (new Matrice(obj.rows - 1, obj.cols - 1, newMat));
    }

    set(i, j, v) {
        this.matrice[`${i}${j}`] = v;
    }

    getM() {
        return this.matrice;
    }

    logM() {
        console.log(this.getM());
    }

    get(i, j) {
        return this.matrice[`${i}${j}`]
    }

    getR() {
        return this.rows
    }

    getC() {
        return this.cols
    }

    swapC(n, k) {
        // Проверка на одинаковые индексы
        if (n === k) {
            console.warn('Cannot swap column with itself');
            return this;
        }

        // Проверка на валидность индексов
        if (n < 0 || n >= this.cols || k < 0 || k >= this.cols) {
            console.error(`Invalid column indices: ${n}, ${k}. Columns count: ${this.cols}`);
            return this;
        }

        // Проверка на минимальное количество столбцов
        if (this.cols < 2) {
            console.warn('Not enough columns to swap');
            return this;
        }

        // Сохраняем оба столбца ДО начала замены
        const colN = [];
        const colK = [];

        for (let i = 0; i < this.rows; i++) {
            colN.push(this.get(i, n));
            colK.push(this.get(i, k));
        }

        // Теперь меняем местами
        for (let i = 0; i < this.rows; i++) {
            this.set(i, n, colK[i]);
            this.set(i, k, colN[i]);
        }

        return this;
    }

    swapR(n, k) {
        // Проверка на одинаковые индексы
        if (n === k) {
            console.warn('Cannot swap row with itself');
            return this;
        }

        // Проверка на валидность индексов
        if (n < 0 || n >= this.rows || k < 0 || k >= this.rows) {
            console.error(`Invalid row indices: ${n}, ${k}. Rows count: ${this.rows}`);
            return this;
        }

        // Проверка на минимальное количество строк
        if (this.rows < 2) {
            console.warn('Not enough rows to swap');
            return this;
        }

        // Сохраняем оба столбца ДО начала замены
        const rowN = [];
        const rowK = [];

        for (let i = 0; i < this.cols; i++) {
            rowN.push(this.get(n, i));
            rowK.push(this.get(k, i));
        }

        // Теперь меняем местами
        for (let i = 0; i < this.cols; i++) {
            this.set(n, i, rowK[i]);
            this.set(k, i, rowN[i]);
        }

        return this;
    }

    copy(sourceType, sourceIndex, destType, destIndex) {
        // sourceType: 'r' (row) или 'c' (column)
        // destType: 'r' (row) или 'c' (column)

        if (sourceType === 'r' && destType === 'c') {
            // Копирование строки в столбец
            this.copyRowToColumn(sourceIndex, destIndex);
        } else if (sourceType === 'c' && destType === 'r') {
            // Копирование столбца в строку
            this.copyColumnToRow(sourceIndex, destIndex);
        } else if (sourceType === 'r' && destType === 'r') {
            // Копирование строки в строку
            this.copyRowToRow(sourceIndex, destIndex);
        } else if (sourceType === 'c' && destType === 'c') {
            // Копирование столбца в столбец
            this.copyColumnToColumn(sourceIndex, destIndex);
        }
        return this;
    }

    multC(n, m){
        for(let i = 0; i < this.rows; i++){
            let v = this.get(i, n);
            this.set(i, n, v * m)
        }
        return this;
    }

    multR(n, m){
        for(let i = 0; i < this.cols; i++){
            let v = this.get(n, i);
            this.set(n, i, v * m)
        }
        return this;
    }

    divideC(n, m){
        for(let i = 0; i < this.rows; i++){
            let v = this.get(i, n);
            if(v/m % 1 > 0){
                console.log("Can't divide", v, m, v/m % 1);
                return this;
            }
        }
        for(let i = 0; i < this.rows; i++){
            let v = this.get(i, n);
            this.set(i, n, v / m)
        }
        return this;
    }

    divideR(n, m){
        for(let i = 0; i < this.cols; i++){
            let v = this.get(n, i);
            if(v/m % 1 > 0){
                console.log("Can't divide", v, m, v/m % 1);
                return this;
            }
        }
        for(let i = 0; i < this.cols; i++){
            let v = this.get(n, i);
            this.set(n, i, v / m)
        }
        return this;
    }

    // Вспомогательные методы
    copyRowToColumn(rowIndex, colIndex) {
        for (let i = 0; i < this.cols; i++) {
            this.set(i, colIndex, this.get(rowIndex, i));
        }
    }

    copyColumnToRow(colIndex, rowIndex) {
        for (let i = 0; i < this.rows; i++) {
            this.set(rowIndex, i, this.get(i, colIndex));
        }
    }

    copyRowToRow(sourceRow, destRow) {
        for (let i = 0; i < this.cols; i++) {
            this.set(destRow, i, this.get(sourceRow, i));
        }
    }

    copyColumnToColumn(sourceCol, destCol) {
        for (let i = 0; i < this.rows; i++) {
            this.set(i, destCol, this.get(i, sourceCol));
        }
    }

}

export default Matrice