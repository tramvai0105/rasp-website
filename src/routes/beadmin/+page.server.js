import { fail, redirect } from '@sveltejs/kit';
import { createClientCookie } from '$lib/server/crypto';
import { CODE_KEY, IS_SERVER } from '$env/static/private';

export const actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();
        const codekey = formData.get('codekey');
        console.log(formData, codekey);

        if (!codekey) {
            return fail(400, { error: 'No codekey provided' });
        }
        console.log(CODE_KEY)
        if (codekey != CODE_KEY) {
            return fail(400, { error: 'Wrong codekey' });
        }

        // Создаем зашифрованную куку
        const clientCookie = createClientCookie(codekey);
        // Устанавливаем куку
        console.log(clientCookie);
        cookies.set('client-key', clientCookie, {
            path: '/',
            httpOnly: true,
            secure: IS_SERVER == "SERVER", // Важно для прода!
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 неделя
        });
    }
};

import { decrypt } from '$lib/server/crypto';

export async function load({ cookies }) {
    const clientKey = cookies.get('client-key');
    console.log(clientKey);
    if(!clientKey){
        return {result : 'No code provided from cookies'}
    }
    const isValid = await decrypt(clientKey);
    console.log(isValid);
    if (!isValid) {
        return {
            result: 'Not an admin'
        };
    }

    return {
        result: 'Is admin'
    };
}