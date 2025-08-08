import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', // Hum proxy use kar rahe hain
  withCredentials: true, // Yeh sabse zaroori hai
});

export default axiosInstance;