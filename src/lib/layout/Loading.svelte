<div class="loading-container">
    <div class="grid grid-cols-2 grid-rows-2 gap-2">
        <div class="loading-dot1 dot-1"></div>
        <div class="loading-dot2 dot-2"></div>
        <div class="loading-dot3 dot-3"></div>
        <div class="loading-dot4 dot-4"></div>
    </div>
    <div class="ml-auto translate-x-30">загружаем...</div>
</div>

<style>
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .loading-dot1 {
        width: 72px;
        height: 72px;
        animation: smoothPulse 2.4s infinite ease-in-out;
    }

    .loading-dot2 {
        width: 72px;
        height: 72px;
        animation: smoothPulse 2.4s infinite ease-in-out;
        animation-delay: 150ms;
    }

    .loading-dot3 {
        width: 72px;
        height: 72px;
        animation: smoothPulse 2.4s infinite ease-in-out;
        animation-delay: 300ms;
    }

    .loading-dot4 {
        width: 72px;
        height: 72px;
        animation: smoothPulse 2.4s infinite ease-in-out;
        animation-delay: 450ms;
    }

    .dot-1 {
        animation-delay: 0s;
        background-color: #fde8eb;
    }

    .dot-2 {
        animation-delay: 0.3s;
        background-color: #fbd1d8;
    }

    .dot-3 {
        animation-delay: 0.9s;
        background-color: #f4758a;
    }

    .dot-4 {
        animation-delay: 0.6s;
        background-color: #f8a3b1;
    }

    @keyframes colorPulse {
        0%, 100% {
            background-color: #fde8eb;
            transform: scale(1);
        }
        16.67% {
            background-color: #fbd1d8;
            transform: scale(0.95);
        }
        33.33% {
            background-color: #f8a3b1;
            transform: scale(0.9);
        }
        50% {
            background-color: #f4758a;
            transform: scale(0.85);
        }
        66.67% {
            background-color: #f14763;
            transform: scale(0.9);
        }
        83.33% {
            background-color: #dc143c;
            transform: scale(0.95);
        }
    }

    /* Альтернативная версия с более плавными переходами */
    @keyframes smoothPulse {
        0% {
            background-color: #fde8eb;
            transform: scale(1);
        }
        25% {
            background-color: #f8a3b1;
            transform: scale(0.9);
        }
        50% {
            background-color: #f14763;
            transform: scale(0.85);
        }
        75% {
            background-color: #f8a3b1;
            transform: scale(0.80);
        }
        100% {
            background-color: #fde8eb;
            transform: scale(0.9);
        }
    }

    /* Для браузерной совместимости */
    .loading-dot {
        -webkit-animation: colorPulse 2.4s infinite ease-in-out;
        -webkit-transform: scale(1);
        transition: transform 0.2s ease;
    }
</style>