import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `http://localhost:3000`,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default axiosClient;