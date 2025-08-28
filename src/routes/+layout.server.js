// import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = ({ locals }) => {
    
//     return {
//         deviceType: locals.deviceType || 'desktop' // fallback на desktop
//     };
// };

import { decrypt } from "$lib/server/crypto";
import { valid } from "$lib/stores/valid.js";

export async function load({ cookies, locals }) {
    const clientKey = cookies.get('client-key');
    let ret = {
        deviceType: locals.deviceType || 'desktop',
        valid: false,
    }
    if(!clientKey){
        return ret
    }
    const isValid = await decrypt(clientKey);
    valid.set(isValid.valid)
    if(isValid.valid){
        ret.valid = true;
    }
    return ret
}