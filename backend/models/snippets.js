import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
    heading: { type: String, require: true },
    description: { type: String, maxlength: 5000 },
    code: { type: String, require: true },
    tags: [{ type: String }],
    language: { type: String },
    type: { type: String }
}, { timestamps: true });

const Snippets = mongoose.model('snippets', snippetSchema);

export default Snippets;