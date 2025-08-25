import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { PageData } from '$types';

export const deviceType = writable<'mobile' | 'desktop' | 'default'>('default');

// Инициализация из данных страницы
export function initDeviceType(pageData: PageData) {
    if (pageData.deviceType) {
        deviceType.set(pageData.deviceType);
    }
}

// Детектор изменения ориентации/размера (опционально)
if (browser) {
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        deviceType.set(isMobile ? 'mobile' : 'desktop');
    });
}