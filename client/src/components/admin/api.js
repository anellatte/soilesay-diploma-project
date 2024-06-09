import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust if necessary
});

// Add a request interceptor to include the token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// News API calls
export const getAllNews = async () => {
    try {
        const response = await api.get('/post');
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/post/${id}`);
        return response.data.post;
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        throw error;
    }
};

export const addNews = async (newsData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsData.get('title'));
        formData.append('message', newsData.get('message'));
        formData.append('image', newsData.get('image'));

        const response = await api.post('/post/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error adding news:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const editNews = async (id, newsData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsData.title);
        formData.append('message', newsData.message);
        if (newsData.image) {
            formData.append('image', newsData.image);
        }

        const response = await api.post(`/post/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating news:', error);
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await api.delete(`/post/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting news:', error);
        throw error;
    }
};

// Talda API calls

export const getAllTalda = async () => {
    try {
        const response = await api.get('/talda/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching talda:', error);
        throw error;
    }
};

export const addTalda = async (taldaData) => {
    try {
        const response = await api.post('/talda', taldaData);
        return response.data;
    } catch (error) {
        console.error('Error adding talda:', error);
        throw error;
    }
};

export const getTaldaById = async (id) => {
    try {
        const response = await api.get(`/talda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching talda by ID:', error);
        throw error;
    }
};

export const editTalda = async (id, taldaData) => {
    try {
        const response = await api.put(`/talda/${id}`, taldaData);
        return response.data;
    } catch (error) {
        console.error('Error updating talda:', error);
        throw error;
    }
};

export const deleteTalda = async (id) => {
    try {
        const response = await api.delete(`/talda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting talda:', error);
        throw error;
    }
};

// SuraqJauap API calls

export const getAllSuraqJauap = async () => {
    try {
        const response = await api.get('/sj/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap:', error);
        throw error;
    }
};

export const addSuraqJauap = async (suraqJauapData) => {
    try {
        const response = await api.post('/sj', suraqJauapData);
        return response.data;
    } catch (error) {
        console.error('Error adding SuraqJauap:', error);
        throw error;
    }
};

export const getSuraqJauapById = async (id) => {
    try {
        const response = await api.get(`/sj/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap by ID:', error);
        throw error;
    }
};

export const editSuraqJauap = async (id, suraqJauapData) => {
    try {
        const response = await api.put(`/sj/${id}`, suraqJauapData);
        return response.data;
    } catch (error) {
        console.error('Error updating SuraqJauap:', error);
        throw error;
    }
};

export const deleteSuraqJauap = async (id) => {
    try {
        const response = await api.delete(`/sj/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting SuraqJauap:', error);
        throw error;
    }
};

// Sozdly API calls


export const getAllSozdly = async () => {
    try {
        const response = await api.get('/sozdly/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching sozdly:', error);
        throw error;
    }
};

export const addSozdly = async (sozdlyData) => {
    try {
        const response = await api.post('/sozdly', sozdlyData);
        return response.data;
    } catch (error) {
        console.error('Error adding sozdly:', error);
        throw error;
    }
};

export const getSozdlyById = async (id) => {
    try {
        const response = await api.get(`/sozdly/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sozdly by ID:', error);
        throw error;
    }
};

export const editSozdly = async (id, sozdlyData) => {
    try {
        const response = await api.put(`/sozdly/${id}`, sozdlyData);
        return response.data;
    } catch (error) {
        console.error('Error updating sozdly:', error);
        throw error;
    }
};

export const deleteSozdly = async (id) => {
    try {
        const response = await api.delete(`/sozdly/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting sozdly:', error);
        throw error;
    }
};


// MaqalDrop API calls

export const getAllMaqalDrop = async () => {
    try {
        const response = await api.get('/maqalDrop/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching MaqalDrop:', error);
        throw error;
    }
};

export const addMaqalDrop = async (maqalDropData) => {
    try {
        const response = await api.post('/maqalDrop', maqalDropData);
        return response.data;
    } catch (error) {
        console.error('Error adding MaqalDrop:', error);
        throw error;
    }
};

export const getMaqalDropById = async (id) => {
    try {
        const response = await api.get(`/maqalDrop/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching MaqalDrop by ID:', error);
        throw error;
    }
};

export const editMaqalDrop = async (id, maqalDropData) => {
    try {
        const response = await api.put(`/maqalDrop/${id}`, maqalDropData);
        return response.data;
    } catch (error) {
        console.error('Error updating MaqalDrop:', error);
        throw error;
    }
};

export const deleteMaqalDrop = async (id) => {
    try {
        const response = await api.delete(`/maqalDrop/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting MaqalDrop:', error);
        throw error;
    }
};
// Puzzle API calls

export const getAllPuzzles = async () => {
    try {
        const response = await api.get('/puzzle/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching puzzles:', error);
        throw error;
    }
};

export const addPuzzle = async (puzzleData) => {
    try {
        const response = await api.post('/puzzle', puzzleData);
        return response.data;
    } catch (error) {
        console.error('Error adding puzzle:', error);
        throw error;
    }
};

export const getPuzzleById = async (id) => {
    try {
        const response = await api.get(`/puzzle/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching puzzle by ID:', error);
        throw error;
    }
};

export const editPuzzle = async (id, puzzleData) => {
    try {
        const response = await api.put(`/puzzle/${id}`, puzzleData);
        return response.data;
    } catch (error) {
        console.error('Error updating puzzle:', error);
        throw error;
    }
};

export const deletePuzzle = async (id) => {
    try {
        const response = await api.delete(`/puzzle/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting puzzle:', error);
        throw error;
    }
};

export const getAllTynda = async () => {
    try {
        const response = await api.get('/tynda');
        return response.data;
    } catch (error) {
        console.error('Error fetching Tynda levels:', error);
        throw error;
    }
};

export const getTyndaById = async (id) => {
    try {
        const response = await api.get(`/tynda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Tynda level by ID:', error);
        throw error;
    }
};

export const addTynda = async (formData) => {
    try {
        const response = await api.post('/tynda', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.message || "Bad request, please check the input.");
        } else {
            throw new Error("An error occurred while adding the Tynda level.");
        }
    }
};

export const updateTynda = async (id, formData) => {
    try {
        const response = await api.put(`/tynda/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.message || "Bad request, please check the input.");
        } else {
            throw new Error("An error occurred while updating the Tynda level.");
        }
    }
};

export const deleteTynda = async (id) => {
    try {
        const response = await api.delete(`/tynda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Tynda level:', error);
        throw error;
    }
};

export default api;
