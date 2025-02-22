import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Axios com base URL da sua API
const instance = axios.create({
  baseURL: 'http://192.168.1.104/apiReact',
});

// Intercepta as requisições para incluir o token de autenticação, se existir
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('token');
  return !!token; // Retorna true se o token existir, caso contrário, retorna false
};

export default instance;