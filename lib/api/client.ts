// Configuration du client API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.defaultHeaders,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.defaultHeaders,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient(API_BASE_URL);
