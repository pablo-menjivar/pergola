import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000', // Cambia el puerto según tu backend
});

export default api;
