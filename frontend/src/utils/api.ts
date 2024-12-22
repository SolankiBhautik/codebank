import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the token is invalid or expired
        if (error.response && error.response.status === 401) {
            // Remove the token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // if (window.location.pathname !== '/login') {
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

export const createSnippet = async (snippetData: any) => {
    try {
        const response = await api.post('/snippets', snippetData);
        return response;
    } catch (error) {
        console.error('Error creating snippet:', error);
        throw error;
    }
};

export const getSnippets = async (searchQuery: string = '') => {
    try {
        const response = await api.get(`/snippets/search?search=${searchQuery}`);
        return response;
    } catch (error) {
        console.error('Error fetching snippets:', error);
        throw error;
    }
};


export const getSnippet = async (id: string) => {
    try {
        const data = await api.get(`/snippets/${id}`);
        return data
    } catch (error) {
        console.error(`Error getting snippet with ID ${id}:`, error);
        throw error;
    }
};

export const updateSnippet = async (id: string | undefined, snippet: any) => {
    try {
        const response = await api.patch(`/snippets/${id}`, snippet);
        return response;
    } catch (error) {
        console.error(`Error updating snippet with ID ${snippet.id}:`, error);
        throw error;
    }
}


export const login = async (credentials: { username: string, password: string }) => {
    try {
        const response = await api.post('/auth', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export const register = async (credentials: { username: string, password: string }) => {
    try {
        const response = await api.post('/auth/register', credentials);
        return response;
    } catch (error) {
        console.error('register error: ', error)
        throw error;
    }
}

export default api;