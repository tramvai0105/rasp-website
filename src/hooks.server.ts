import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Игнорируем запросы не для HTML
    if (!event.request.headers.get('accept')?.includes('text/html')) {
        return resolve(event);
    }
    
    const userAgent = event.request.headers.get('user-agent') || '';
    const isMobile = /iPhone|iPad|iPod|Android|Mobile|CriOS/i.test(userAgent);
    
    event.locals.deviceType = isMobile ? 'mobile' : 'desktop';
    
    // console.log('HTML request - UA:', userAgent);
    // console.log('HTML request - Device:', event.locals.deviceType);

    // Редиректы только для HTML запросов
    if (isMobile && event.route.id?.includes('(desktop)')) {
        throw redirect(302, event.url.pathname.replace('(desktop)', '(mobile)'));
    }
    
    if (!isMobile && event.route.id?.includes('(mobile)')) {
        throw redirect(302, event.url.pathname.replace('(mobile)', '(desktop)'));
    }

    return resolve(event);
};