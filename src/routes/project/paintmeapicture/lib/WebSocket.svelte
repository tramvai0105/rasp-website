<script>
    import clsx from "clsx";
    import { onMount} from 'svelte';
    import { browser } from '$app/environment';

    export let url = "ws://localhost:3000/ws";
    export let setBoard;

    let data = "";
    let isConnected = false;
    export let setIsConnected;
    export let setUpdateId;
    let action = "getPixels";
    let socket;

    const getWebSocketUrl = () => {
        try {
            if (browser) {
                const protocol =
                    window.location.protocol === "https:" ? "wss:" : "ws:";
                const host = window.location.hostname;
                return `${protocol}//${host}:3000/ws`;
            }
        } catch (e) {
            console.warn("Не удалось определить URL, используется localhost");
        }
        return "ws://localhost:3000/ws"; // Fallback
    };

    onMount(() => {
        const wsUrl = getWebSocketUrl();
        console.log("Подключаемся к WebSocket:", wsUrl); // Логируем URL
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            isConnected = true;
            sendMessage();
        };

        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg.action === "getPixels") {
                setBoard(msg.data);
                setUpdateId();
            }
            if (msg.action === "pixelsUpdate") {
                setBoard(msg.data);
                setUpdateId();
            }
        };

        socket.onclose = () => {
            isConnected = false;
        };

        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    });

    // Экспортируем функцию для отправки данных
    export function send(action, data) {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    action: action,
                    data: data,
                }),
            );
            data = "";
        }
    }

    function sendMessage() {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    action: action,
                    data: data,
                }),
            );
            data = "";
        }
    }
</script>

<div class="text-sm flex flex-row gap-1 items-center">
    Статус подключения
    <div
        class={clsx(
            { "bg-green-400": isConnected },
            { "bg-rose-400": !isConnected },
            "w-[14px] h-[14px] rounded-full",
        )}
    ></div>
</div>
