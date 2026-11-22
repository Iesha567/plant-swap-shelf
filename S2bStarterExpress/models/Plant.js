

import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		species: { type: String, required: true },
		swapped: { type: Boolean, default: false },
		lightNeeds: {
			type: String,
			enum: ['low', 'medium', 'bright'],
			required: true
		}
	},
	{
		// MongoDB stores each document's id as _id. This option makes the JSON
		// we send out include a plain "id" as well, which is what the
		// SvelteKit app reads.
		toJSON: { virtuals: true }
	}
);

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
