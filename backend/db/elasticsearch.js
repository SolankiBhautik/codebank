import { Client } from '@elastic/elasticsearch'

const client = new Client({
    node: 'http://elasticsearch:9200',
    auth: {
        username: 'elastic',
        password: 'bhautik'
    }
});

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

export default client; 
