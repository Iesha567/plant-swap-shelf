# plant-swap-shelf

# Plant Swap Shelf

A plant swapping website built using SvelteKit, Express and MongoDB.

## Running the projects

**Express API** (Terminal 1):

```bash
cd S2bStarterExpress
npm install
npm run dev
```

Runs on `http://localhost:3001`.

**SvelteKit** (Terminal 2):

```bash
cd S2bStarterSveltekit
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Both servers must be running.

## Follow the flow

### 1. Database and collection

The database is called `PlantIesha` and is named in the `MONGODB_URI` connection string in the Express `.env` file. The `Plant` model in `models/Plant.js` determines the collection name, which MongoDB stores as `plants`.

### 2. Filtering plants

When a visitor opens `/shelf?light=low`, `+page.server.js` reads the URL parameter and passes it to `fetchPlants()` in `plantApi.js`. Express receives it through `req.query.light` in `index.js` and passes it to `getAll()` in `sketchData.js`. Mongoose then finds plants matching that light requirement.

### 3. Plant IDs

Each plant has a MongoDB `_id`, which is included in the JSON returned by Express. Express makes the ID available through `req.params.id`. SvelteKit uses the ID in `/shelf/[id]` to fetch and display the individual plant.

## Environment variables

Each project has its own `.env` file and `.env.example`. 
