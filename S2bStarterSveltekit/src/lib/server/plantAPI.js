import { PLANT_API_URL } from '$app/env/private';

// Get every sketch.
export async function fetchPlants(light) {
	// await means: pause here until Express answers, then carry on.
	const url = light
		? `${PLANT_API_URL}/api/plants?light=${light}`
		: `${PLANT_API_URL}/api/plants`;

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Plant API responded with ${res.status}`);
	}

	return res.json();
}


export async function fetchPlant(id) {
    const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`);

    if (res.status === 404) return null;

    if (!res.ok) {
        throw new Error(`Plant API responded with ${res.status}`);
    }

    return res.json();
}

// Add a sketch. `data` looks like { title, artist, colorTag }.
export async function createPlant(data) {
	const res = await fetch(`${PLANT_API_URL}/api/plants`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (!res.ok) {
		throw new Error(`Plant API responded with ${res.status}`);
	}

	return res.json();
}

// Change some fields of one sketch, e.g. changes = { favourite: true }.
// Gives back the updated sketch, or null if there is no sketch with that id.
export async function updatePlant(id, changes) {
	const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(changes)
	});

	if (res.status === 404) {
		return null;
	}

	if (!res.ok) {
		throw new Error(`Plant API responded with ${res.status}`);
	}

	return res.json();
}

// Delete one sketch. Gives back true if it was deleted, false if there was
// no sketch with that id.
export async function deletePlant(id) {
	const res = await fetch(`${PLANT_API_URL}/api/plants/${id}`, {
		method: 'DELETE'
	});

	if (res.status === 404) {
		return false;
	}

	// A successful delete answers 204 (No Content), so there is no body to read.
	if (!res.ok) {
		throw new Error(`Plant API responded with ${res.status}`);
	}

	return true;
}
