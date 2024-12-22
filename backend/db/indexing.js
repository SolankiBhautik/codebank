import Snippets from "../models/snippets.js";
import client from "./elasticsearch.js";

await client.indices.delete({ index: 'snippets' });
console.log('Index deleted successfully.');

await client.indices.create({
    index: 'snippets',
    body: {
        mappings: {
            properties: {
                heading: { type: 'text' },
                description: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                code: { type: 'text' },
                tags: { type: 'keyword' },
                language: { type: 'text' },
                type: { type: 'text' },
                createdAt: { type: 'date' }
            }
        }
    }
});
console.log('New index created successfully.');


async function indexAllRecords() {
    try {
        // Fetch all records from MongoDB
        const snippets = await Snippets.find();
        if (snippets.length === 0) {
            console.log("No snippets found to index.");
            return;
        }


        // Loop through each snippet and index it
        for (const snippet of snippets) {
            const tempSnippet = {
                heading: snippet.heading || '',
                description: snippet.description || '',
                tags: snippet.tags || [],
                language: snippet.language || '',
                type: snippet.type || '',
                createdAt: snippet.createdAt || new Date(),
                code: snippet.code || ''
            };

            console.log('Indexing snippet:', snippet.id);  // Log each snippet before indexing

            // Index the snippet using client.index
            await client.index({
                index: 'snippets',
                id: snippet.id,
                body: tempSnippet
            });
        }

        // Refresh the index to make documents searchable
        await client.indices.refresh({ index: 'snippets' });

        // Check and log the number of indexed documents
        const res = await client.count({ index: 'snippets' });
        console.log('Total records indexed:', res.count);
    } catch (error) {
        console.error('Error indexing records:', error);
    }
}
// indexAllRecords();





