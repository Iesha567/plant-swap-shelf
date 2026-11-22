import { error } from '@sveltejs/kit';
import { fetchPlant } from '#lib/server/plantApi.js';

export async function load({ params }) {
    try {
        const plant = await fetchPlant(params.id);

        if (!plant) {
            error(404, 'Plant not found');
        }

        return { plant };
    } catch (err) {
        if (err.status === 404) throw err;

        console.error(err);
        error(500, 'Could not load plant');
    }
}