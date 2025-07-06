<script>
    import Board from "./lib/Board.svelte";
    import Meaning from "./lib/Meaning.svelte";
    import Pallete from "./lib/Pallete.svelte";
    import WebSocket from "./lib/WebSocket.svelte";

    const title = "PaintMeAPicture";
    const description = "";

    let color = "#f94144";
    let bruh = (new Array(9)).fill(false);
    bruh[0] = true;

    function setColor(_color) {
        color = _color;
    }
    function setBruh(pos) {
        bruh[pos] = !bruh[pos];
    }

    let w = 16;
    let h = 16;

    let cells = new Array(w * h).fill("#ffffff");
    let isConnected;
    function setIsConnected(status){
        isConnected = status;
    }
    let updateId = 0;
    let ws; // сохраняем ссылку на WebSocket компонент

    let bruhCoords = [[1,1], [2, 1], [3, 1], [1,2], [2, 2], [3, 2],[1,3], [2, 3], [3, 3]]

    function setCells(x, y){
        bruh.forEach((v, i)=>{
            if(!v){
                return;
            }
            let coord = bruhCoords[i];
            let coords = ((x + coord[1] - 1) * h) + (y + coord[0] - 1);
            if(coords < w * h){
                cells[coords] = color;
            }
        })
        ws.send("paint", cells);
    }

    function setBoard(board){
        cells = board;
    }

    function setUpdateId(){
        updateId = updateId + 1;
    }

</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="w-full min-h-[100vh] flex flex-col px-[3%]">
    <span></span>
    <div class="w-fit mx-auto mt-6 h-fit">
        <div
            class="pl-7 select-none pr-6 hover:bg-[#dc143c] hover:text-white backdrop-blur-sm font-bold title-color tracking-[14px] text-2xl"
        >
            {title}
        </div>
    </div>
    <div class="w-full mt-6 h-full flex grow flex-row justify-center">
        <Meaning/>
        <Board updateId={updateId} {color} {cells} setCells={setCells}/>
        <Pallete selectedColor={color} {setColor} {bruh} {setBruh}>
            <WebSocket bind:this={ws} setUpdateId={setUpdateId} setBoard={setBoard} setIsConnected={setIsConnected}/>
        </Pallete>
    </div>
</div>

<style>
    .title-color{
        animation: title-color-anim 500ms ease-in both;
        transition-property: background-color;
        transition-duration: 500ms;
    }
    .title-color:hover{
        color: white !important;
    }
    @keyframes title-color-anim{
        0%{
            opacity: 0;
            color:white;
        }
        100%{
            opacity: 1;
            color:#dc143c
        }
    }
</style>