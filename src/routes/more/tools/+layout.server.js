import { redirect } from '@sveltejs/kit';

export async function load({parent}){
    const {valid} = await parent();
    if(!valid){
        throw redirect(404, "/");
    }
}