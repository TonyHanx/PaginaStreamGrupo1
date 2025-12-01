import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    puntos: number;
    monedas: number;
    nivel: number;
    xp: number;
    isStreamer: boolean;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(API_ENDPOINTS.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(API_ENDPOINTS.auth.profile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    return response.json();
  },

  saveToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  saveUser(user: AuthResponse['user']) {
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('USUARIO', JSON.stringify({
      username: user.username,
      puntos: user.puntos,
      monedas: user.monedas,
      nivel: user.nivel,
      xp: user.xp,
      userId: user.id,
      id: user.id,
      isStreamer: user.isStreamer,
      streamerId: (user as any).streamerId || null,
      nivelStreamer: (user as any).streamerNivel || user.nivel,
      xpStreamer: (user as any).streamerXp || user.xp
    }));
  },

  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('USUARIO');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
