<script>
	let { data } = $props();
</script>

<main>
	<p><a href="/shelf">← Back to the shelf</a></p>

	<h1>{data.plant.name}</h1>
	<p><strong>Species:</strong> {data.plant.species}</p>
	<p><strong>Light requirements:</strong> {data.plant.lightNeeds}</p>
	<p><strong>Status:</strong> {data.plant.swapped ? 'Swapped' : 'Available'}</p>
</main>