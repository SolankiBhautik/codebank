import Snippets from '../models/snippets.js'
import client from '../db/elasticsearch.js'

export const search = async (req, res) => {
    try {
        const { search } = req.query;

        let query;

        if (search) {
            // If search query is provided, build an advanced query
            query = {
                bool: {
                    should: [
                        // Fuzzy match for headings with a boost
                        {
                            match: {
                                heading: {
                                    query: search,
                                    fuzziness: "AUTO", // Allow typo tolerance
                                    boost: 4 // Prioritize heading matches
                                }
                            }
                        },
                        // // Fuzzy match for description
                        // {
                        //     match: {
                        //         description: {
                        //             query: search,
                        //             fuzziness: "AUTO"
                        //         }
                        //     }
                        // },
                        // Exact match for tags
                        {
                            terms: {
                                tags: [search]
                            }
                        },
                        // Fuzzy match for language
                        {
                            match: {
                                language: {
                                    query: search,
                                }
                            }
                        },
                    ],
                    minimum_should_match: 1 // At least one of the conditions must match
                }
            };
        } else {
            // If no search query, fetch the most popular or recent records
            query = {
                match_all: {}
            };
        }

        // Execute search in Elasticsearch
        const body = await client.search({
            index: 'snippets',
            body: {
                query: query,
                size: 20, // Limit results
                sort: [
                    "_score", // Sort by relevance
                    { createdAt: "desc" } // Secondary sort by recency
                ]
            }
        });

        res.json(body.hits.hits);
    } catch (error) {
        console.error('Error searching Elasticsearch:', error);
        res.status(500).json({ message: 'Error searching Elasticsearch' });
    }
};


// Get a single Snippet by ID
export const show = async (req, res) => {
    try {
        const data = await Snippets.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Snippets not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: `server error while getting a snippet ${err.message}` });
    }
};

export const create = async (req, res) => {
    try {
        const { heading, description, code, tags, language, type } = req.body;
        if (!heading || !code) {
            return res.status(400).json({
                message: "Heading and code are required fields"
            });
        }
        const snippet = new Snippets({
            heading,
            description,
            code,
            tags: tags || [],
            language: language || 'javascript',
            type: type || 'Utility',
        });
        const savedSnippet = await snippet.save();

        await client.index({
            index: 'snippets',
            id: savedSnippet.id,
            body: {
                id: savedSnippet.id,
                heading: savedSnippet.heading,
                description: savedSnippet.description,
                code: savedSnippet.code,
                tags: savedSnippet.tags,
                language: savedSnippet.language,
                type: savedSnippet.type,
                createdAt: savedSnippet.createdAt
            }
        });
        // Refresh the Elasticsearch index immediately to make the change visible
        await client.indices.refresh({ index: 'snippets' });

        res.status(201).json({
            message: "Snippet created successfully",
            snippet: savedSnippet
        });
    } catch (err) {
        console.error('Snippet creation error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors
            });
        }
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};


// Update a Snippet by ID
export const update = async (req, res) => {
    try {
        const updatedSnippets = await Snippets.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedSnippets) return res.status(404).json({ message: "Snippets not found" });

        await client.update({
            index: 'snippets',
            id: req.params.id,
            doc: req.body
        });
        // Refresh the Elasticsearch index immediately to make the change visible
        await client.indices.refresh({ index: 'snippets' });

        res.status(200).json(updatedSnippets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a Snippet by ID
export const remove = async (req, res) => {
    try {
        const deletedSnippets = await Snippets.findByIdAndDelete(req.params.id);
        if (!deletedSnippets) return res.status(404).json({ message: "Snippets not found" });


        await client.delete({
            index: 'snippets',
            id: req.params.id
        });
        // Refresh the Elasticsearch index immediately to make the change visible
        await client.indices.refresh({ index: 'snippets' });

        res.status(200).json({ message: "Snippets deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
