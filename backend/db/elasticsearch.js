import { Client } from '@elastic/elasticsearch'

const client = new Client({
    node: 'http://elasticsearch:9200',
    auth: {
        username: 'elastic',
        password: 'bhautik'
    }
});


export default client; 
