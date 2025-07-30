// Spring Boot Authentication Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
  message?: string;
}

class SpringBootAuthService {
  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  }

  async loginWithGoogle(): Promise<void> {
    // Redirect to Spring Boot Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorize/google`;
  }

  async loginWithFacebook(): Promise<void> {
    // Redirect to Spring Boot Facebook OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorize/facebook`;
  }

  async handleOAuthCallback(provider: string): Promise<AuthResponse> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      throw new Error('Authorization code not found');
    }

    const response = await this.makeRequest(`/api/auth/oauth/callback/${provider}`, {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OAuth authentication failed');
    }

    return data;
  }

  saveAuthData(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const springBootAuth = new SpringBootAuthService();