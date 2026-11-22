<script>
	// `data` holds what load() in +page.server.js returned.
	let { data } = $props();

	// $state makes these reactive: the page updates when they change.
	let name = $state("");
	let species = $state("");
	let lightNeeds = $state("medium");
	let submitting = $state(false);
	let submitError = $state("");
	let listError = $state("");

	// Our own copy of the list, seeded from load()'s data, so the page can
	// change straight after an add, star or delete without a reload.
	let plants = $state(data.plants);

	// ADD — the form. A plain fetch() to OUR OWN /api/sketches route
	// (src/routes/api/sketches/+server.js), never straight to Express.
	// SvelteKit forwards it to Express.
	async function handleSubmit(event) {
		event.preventDefault(); // stop the browser reloading the page
		submitting = true;
		submitError = "";

		try {
			// await means: pause here until the server answers, then carry on.
			const res = await fetch("/api/plants", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, species, lightNeeds }),
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// The API sends back the saved sketch (with its id). Add it to our list.
			const newPlant = await res.json();
			plants.push(newPlant);

			name = "";
			species = "";
			lightNeeds = "medium";
		} catch (err) {
			submitError = "Could not add that plant. Is the API running?";
			console.error(err);
		} finally {
			submitting = false;
		}
	}

	// UPDATE — the favourite star. A PATCH to OUR OWN /api/sketches/<id>
	// route (src/routes/api/sketches/[id]/+server.js), sending only the
	// field that changes.
	async function toggleSwapped(plant) {
		listError = "";

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ swapped: !plant.swapped }),
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// The API sends back the updated sketch. Copy the new value onto
			// the sketch in our list and the star changes.
			const updated = await res.json();
			plant.swapped = updated.swapped;
		} catch (err) {
			listError = "Could not update that sketch. Is the API running?";
			console.error(err);
		}
	}

	// DELETE — the ✕ button. A successful delete answers 204 (No Content),
	// so there is no body to read.
	async function deletePlant(plant) {
		listError = "";

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// Rebuild our list without that sketch: filter keeps every sketch
			// whose id is NOT the one we deleted.
			plants = plants.filter((p) => p.id !== plant.id);
		} catch (err) {
			listError = "Could not delete that plant. Is the API running?";
			console.error(err);
		}
	}
</script>

<main>
	<h1>Plant Swap Shelf</h1>
	<p><a href="/">← Home</a></p>
	<nav>
		<a href="/shelf">All</a>
		<a href="/shelf?light=low">Low light</a>
		<a href="/shelf?light=medium">Medium light</a>
		<a href="/shelf?light=bright">Bright light</a>
	</nav>

	{#if listError}
		<p class="error">{listError}</p>
	{/if}

	<ul class="sketch-list">
		{#each plants as plant (plant.id)}
			<li class="sketch-card">
				<div>
					<strong><a href={`/shelf/${plant.id}`}>{plant.name}</a></strong>
					<span class="artist">{plant.species}</span>
					<p>Light: {plant.lightNeeds}</p>
					<p>{plant.swapped ? "Swapped" : "Available"}</p>
				</div>

				<div class="buttons">
					<button onclick={() => toggleSwapped(plant)}>
						{plant.swapped ? "Mark available" : "Mark swapped"}
					</button>

					<button
						class="icon-button delete"
						onclick={() => deletePlant(plant)}
					>
						✕
					</button>
				</div>
			</li>
		{/each}
	</ul>

	<h2>Add a plant</h2>
	<form onsubmit={handleSubmit}>
		<label>
			Name
			<input type="text" bind:value={name} required />
		</label>
		<label>
			Species
			<input type="text" bind:value={species} required />
		</label>
		<label>
			Light requirements
			<select bind:value={lightNeeds} required>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="bright">Bright</option>
			</select>
		</label>
		<button type="submit" disabled={submitting}>
			{submitting ? "Adding…" : "Add plant"}
		</button>
		{#if submitError}
			<p class="error">{submitError}</p>
		{/if}
	</form>
</main>

<style>
	main {
		max-width: 36rem;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, sans-serif;
	}
	.sketch-list {
		list-style: none;
		padding: 0;
	}
	.sketch-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-left: 6px solid #ccc;
		background: #f8f8f8;
		padding: 0.75rem 1rem;
		margin-bottom: 0.5rem;
		border-radius: 4px;
	}
	.artist {
		color: #666;
		margin-left: 0.5rem;
		font-size: 0.9rem;
	}
	.buttons {
		display: flex;
		gap: 0.25rem;
	}
	.icon-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #ccc;
	}
	.icon-button.is-favourite {
		color: #f5a623;
	}
	.icon-button.delete:hover {
		color: #b91c1c;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 20rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
	}
	.error {
		color: #b91c1c;
	}
</style>
