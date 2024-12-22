import mongoose from 'mongoose';
import Snippets from '../models/snippets.js';
import client from '../db/elasticsearch.js';

// Watch for changes in the Snippets collection
Snippets.watch().on('change', async (change) => {
    switch (change.operationType) {
        case 'insert':
            // Sync new documents to Elasticsearch
            await client._index({
                index: 'snippets',
                document: change.fullDocument
            });
            break;
        case 'update':
            // Sync updated documents to Elasticsearch
            await client.update({
                index: 'snippets',
                id: change.documentKey.id,
                doc: change.updateDescription.updatedFields
            });
            break;
        case 'delete':
            // Delete documents from Elasticsearch
            await client.delete({
                index: 'snippets',
                id: change.documentKey.id
            });
            break;
    }
});

