export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
  ? 'https://paginastreamgrupo1.onrender.com' 
  : 'http://localhost:3000');

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    profile: `${API_URL}/api/auth/profile`,
    updateXP: `${API_URL}/api/auth/xp`,
  },
  streams: `${API_URL}/api/streams`,
  gifts: {
    default: `${API_URL}/api/gifts/default`,
    streamer: (streamerId: string) => `${API_URL}/api/gifts/streamer/${streamerId}`,
    create: `${API_URL}/api/gifts/custom`,
    send: `${API_URL}/api/gifts/send`,
    balance: `${API_URL}/api/gifts/balance`,
    buyCoins: `${API_URL}/api/gifts/buy-coins`,
    transactions: `${API_URL}/api/gifts/transactions`,
  },
};

