
import 'dotenv/config'; // reads the .env file into process.env
import express from 'express';
import mongoose from 'mongoose';
import * as plantData from './lib/sketchData.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Parses incoming JSON request bodies into req.body.
app.use(express.json());

// A request logger, handy when two servers are running side by side.
app.use((req, res, next) => {
	console.log(`[plant-api] ${req.method} ${req.path}`);
	next();
});

// --- GET /api/sketches — list every sketch ---------------------------------
app.get('/api/plants', async (req, res) => {
	try {
		// await means: pause here until the database answers, then carry on.
		const plants = await plantData.getAll(req.query.light);
		res.json(plants);
	} catch (err) {
		console.error('Failed to read plants:', err.message);
		res.status(500).json({ error: 'Could not read plants' });
	}
});
// GET /api/plants/:id — get one plant
app.get('/api/plants/:id', async (req, res) => {
	try {
		const id = req.params.id;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(404).json({ error: 'Invalid plant ID' });
		}

		const plant = await plantData.getById(id);

		if (!plant) {
			return res.status(404).json({ error: 'Plant not found' });
		}

		res.json(plant);
	} catch (err) {
		console.error('Failed to read plant:', err.message);
		res.status(500).json({ error: 'Could not read plant' });
	}
});

// --- POST /api/sketches — add a new sketch ----------------------------------
app.post('/api/plants', async (req, res) => {
	try {
		// With no Content-Type header, req.body is undefined, so check first.
		if (!req.body) {
			return res.status(400).json({ error: 'name, species and lightNeeds are all required' });
		}

		const { name, species, lightNeeds } = req.body;

		// 400 = Bad Request: the caller left out something we need.
		if (!name || !species || !lightNeeds) {
			return res.status(400).json({ error: 'name, species and lightNeeds are all required' });
		}

		const newPlant = await plantData.create({ name, species, lightNeeds });

		// 201 = Created: it worked AND a new sketch now exists.
		res.status(201).json(newPlant);
	} catch (err) {
		console.error('Failed to create plant:', err.message);
		res.status(500).json({ error: 'Could not create plant' });
	}
});

// --- PATCH /api/sketches/:id — change some fields of one sketch --------------
// The URL says WHICH sketch (:id). The JSON body says WHAT to change,
// e.g. { "favourite": true }.
app.patch('/api/plants/:id', async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({ error: 'a JSON body of changes is required' });
		}

		// The id stays as text: MongoDB ids are text, so there is no Number() here.
		const updated = await plantData.update(req.params.id, req.body);

		// 404 = Not Found: the request was fine, but no sketch has this id.
		if (!updated) {
			return res.status(404).json({ error: `No plant found with id ${req.params.id}` });
		}

		res.json(updated);
	} catch (err) {
		console.error('Failed to update plants:', err.message);
		res.status(500).json({ error: 'Could not update plant' });
	}
});

// --- DELETE /api/sketches/:id — remove one sketch ----------------------------
app.delete('/api/plants/:id', async (req, res) => {
	try {
		const removed = await plantData.remove(req.params.id);

		if (!removed) {
			return res.status(404).json({ error: `No plant found with id ${req.params.id}` });
		}

		// 204 = No Content: it worked, and there is nothing left to send back.
		res.status(204).send();
	} catch (err) {
		console.error('Failed to delete plant:', err.message);
		res.status(500).json({ error: 'Could not delete plant' });
	}
});

// --- Connect to MongoDB, then start listening --------------------------------
// The connection string (MONGODB_URI) comes from .env. The database name is
// part of that string. The collection comes from the model's name (see
// models/Sketch.js).
async function start() {
	try {
		// await means: pause here until Atlas answers, then carry on.
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('Could not connect to MongoDB. Check MONGODB_URI in .env:', err.message);
		process.exit(1);
	}

	app.listen(PORT, () => {
		console.log(`Plant Swap Shelf API listening on http://localhost:${PORT}`);
	});
}

start();
