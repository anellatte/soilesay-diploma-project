import axios from 'axios';

const BASE_URL = "http://localhost:8000";

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Add a request interceptor to include the token
const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// User Authentication
export const signIn = async (email, password) => {
    try {
        const res = await api.post('/login', { email, password });
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return res.data;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const signUp = async (username, email, password) => {
    try {
        const res = await api.post('/signup', { username, email, password });
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return res.data;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/api/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const formData = new FormData();
        formData.append('avatar', userData.avatar);
        formData.append('username', userData.username);
        formData.append('email', userData.email);

        const response = await api.post('/api/profile/updateProfile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Talda API calls
export const getTaldaByLevel = async (level) => {
    try {
        const response = await api.get('/api/profile/level', { params: { level } });
        if (!response.data || !response.data.text) {
            return { noData: true };
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching talda by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true };
        }
        return { error: true };
    }
};

export const getCompletedTalda = async () => {
    try {
        const response = await api.get('/api/profile/completed');
        return response.data;
    } catch (error) {
        console.error('Error fetching completed talda:', error);
        throw error;
    }
};

export const updateTaldaLevel = async (currentLevel) => {
    try {
        const response = await api.post('/api/profile/updateLevel', { level: currentLevel });
        return response.data;
    } catch (error) {
        console.error('Error updating talda level:', error);
        return { message: 'Error', taldaLevel: null };
    }
};

// SuraqJauap API calls
export const getSuraqJauapByLevel = async (level) => {
    try {
        const response = await api.get('/api/profile/sjlevel', { params: { level: Number(level) } });
        if (!response.data || !response.data.text) {
            return { noData: true };
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true };
        }
        return { error: true };
    }
};

export const getCompletedSuraqJauap = async () => {
    try {
        const response = await api.get('/api/profile/sjcompleted');
        return response.data;
    } catch (error) {
        console.error('Error fetching completed SuraqJauap levels:', error);
        throw error;
    }
};

export const updateSuraqJauapLevel = async (currentLevel) => {
    try {
        const response = await api.post('/api/profile/sjupdateLevel', { level: Number(currentLevel) });
        return response.data;
    } catch (error) {
        console.error('Error updating SuraqJauap level:', error);
        return { message: 'Error', suraqJauapLevel: null };
    }
};

// Event API calls
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/api/events/create', eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const approveEvent = async (eventId) => {
    try {
        const response = await api.put(`/api/events/approve/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error approving event:', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const response = await api.delete(`/api/events/delete/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

export const getApprovedEvents = async () => {
    try {
        const response = await api.get('/api/events');
        return response.data;
    } catch (error) {
        console.error('Error fetching approved events:', error);
        throw error;
    }
};

export const getAllEvents = async () => {
    try {
        const response = await api.get('/api/events/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all events:', error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await api.get('/api/events/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await api.put(`/api/events/notifications/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

// Sozdly API calls
export const getSozdlyByLevel = async (level) => {
    try {
        const response = await api.get('/api/profile/sozdlylevel', { params: { level } });
        if (!response.data || !response.data.word) {
            return { noData: true };
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching sozdly by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true };
        }
        return { error: true };
    }
};

export const getCompletedSozdly = async () => {
    try {
        const response = await api.get('/api/profile/sozdlycompleted');
        return response.data;
    } catch (error) {
        console.error('Error fetching completed sozdly:', error);
        throw error;
    }
};

export const updateSozdlyLevel = async (currentLevel) => {
    try {
        const response = await api.post('/api/profile/sozdlyupdateLevel', { level: currentLevel });
        return response.data;
    } catch (error) {
        console.error('Error updating sozdly level:', error);
        return { message: 'Error', sozdlyLevel: null };
    }
};

// MaqalDrop API calls

// Get MaqalDrop level by specific level number
export const getMaqalDropByLevel = async (level) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/maqalDropLevel`, {
            params: { level: Number(level) },
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        console.log(`Fetched MaqalDrop data for level ${level}:`, response.data);
        if (!response.data || !response.data.sentence) {
            return { noData: true }; // Indicate no data found for this level
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching MaqalDrop by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true }; // Handle 404 error
        }
        return { error: true }; // Indicate an error occurred
    }
};

// Get all completed MaqalDrop levels for the current user
export const getCompletedMaqalDrop = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/maqalDropCompleted`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching completed MaqalDrop levels:', error);
        throw error;
    }
};

// Update the user's MaqalDrop level
export const updateMaqalDropLevel = async (currentLevel) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/profile/maqalDropUpdateLevel`, { level: Number(currentLevel) }, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating MaqalDrop level:', error);
        return { message: 'Error', maqalDropLevel: null };
    }
};


export default api;
