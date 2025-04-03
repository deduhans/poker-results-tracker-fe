import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosClient;
