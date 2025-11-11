import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import type { ApiResponse, PaginatedResponse, Pool, Bet, User, AdminStats, RumbleData } from '../types';

/**
 * Axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log requests in debug mode
      if (env.enableDebug) {
        console.log('[API Request]', config.method?.toUpperCase(), config.url);
      }

      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log responses in debug mode
      if (env.enableDebug) {
        console.log('[API Response]', response.config.url, response.status);
      }

      return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
      // Handle common errors
      if (error.response) {
        const { status, data } = error.response;

        if (env.enableDebug) {
          console.error('[API Error]', status, data);
        }

        // Handle specific error codes
        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('auth_token');
            if (window.location.pathname.startsWith('/admin')) {
              window.location.href = '/admin/login';
            }
            break;

          case 403:
            console.error('Access forbidden');
            break;

          case 404:
            console.error('Resource not found');
            break;

          case 500:
            console.error('Server error');
            break;

          default:
            console.error('API Error:', data?.error || 'Unknown error');
        }
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Request setup error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * API service methods
 */
export const api = {
  // Pool endpoints
  pools: {
    list: () => apiClient.get<ApiResponse<Pool[]>>('/api/v1/pools'),
    get: (id: string) => apiClient.get<ApiResponse<Pool>>(`/api/v1/pools/${id}`),
    active: () => apiClient.get<ApiResponse<Pool[]>>('/api/v1/pools/active'),
  },

  // Bet endpoints
  bets: {
    list: (walletAddress: string) =>
      apiClient.get<ApiResponse<Bet[]>>(`/api/v1/bets/user/${walletAddress}`),
    get: (id: string) => apiClient.get<ApiResponse<Bet>>(`/api/v1/bets/${id}`),
    simulate: (data: { poolId: string; amount: string; traderChoice: number }) =>
      apiClient.post<ApiResponse<{
        amount: string;
        traderChoice: number;
        currentOdds: number;
        potentialPayout: string;
        platformFee: string;
        netPayout: string;
      }>>('/api/v1/bets/simulate', data),
    create: (data: { poolId: string; amount: string; traderChoice: number }) =>
      apiClient.post<ApiResponse<Bet>>('/api/v1/bets', data),
    poolBets: (poolId: string) =>
      apiClient.get<ApiResponse<Bet[]>>(`/api/v1/bets/pool/${poolId}`),
    claim: (id: string) =>
      apiClient.patch<ApiResponse<Bet>>(`/api/v1/bets/${id}/claim`),
  },

  // User endpoints
  users: {
    get: (walletAddress: string) =>
      apiClient.get<ApiResponse<User>>(`/users/${walletAddress}`),
    stats: (walletAddress: string) =>
      apiClient.get<ApiResponse<{ totalBets: number; totalWinnings: number; winRate: number }>>(
        `/users/${walletAddress}/stats`
      ),
  },

  // Admin endpoints
  admin: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post<ApiResponse<{ token: string; user: { email: string; role: string } }>>(
        '/admin/login',
        credentials
      ),
    stats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),
    pools: {
      list: (params?: { page?: number; perPage?: number; status?: string }) =>
        apiClient.get<ApiResponse<PaginatedResponse<Pool>>>('/admin/pools', { params }),
      create: (data: Partial<Pool>) =>
        apiClient.post<ApiResponse<Pool>>('/admin/pools', data),
      update: (id: string, data: Partial<Pool>) =>
        apiClient.put<ApiResponse<Pool>>(`/admin/pools/${id}`, data),
      delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`/admin/pools/${id}`),
      lock: (id: string) =>
        apiClient.post<ApiResponse<Pool>>(`/admin/pools/${id}/lock`),
      settle: (id: string, data: { winningSide: 'yes' | 'no' }) =>
        apiClient.post<ApiResponse<Pool>>(`/admin/pools/${id}/settle`, data),
    },
    bets: {
      list: (params?: { page?: number; perPage?: number; poolId?: string }) =>
        apiClient.get<ApiResponse<PaginatedResponse<Bet>>>('/admin/bets', { params }),
    },
  },
};

/**
 * Rumble/Arena API functions (from kin/phase-0)
 * Note: These use the same backend server but different endpoint structure
 */
export const fetchRumble = async (id: string): Promise<RumbleData> => {
  try {
    const response = await apiClient.get(`/api/rumbles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rumble:', error);
    throw new Error('Failed to load rumble');
  }
};

export const listRumbles = async (): Promise<RumbleData[]> => {
  try {
    const response = await apiClient.get('/api/rumbles');
    return response.data;
  } catch (error) {
    console.error('Error fetching rumbles:', error);
    throw new Error('Failed to load rumbles');
  }
};
