import { tokenStorage } from '../utils/tokenStorage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Standard HTTP client with automatic Authorization header injection
 * and 401 interception.
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = tokenStorage.getToken()
  const tenantId = tokenStorage.getTenantId()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`
    const response = await fetch(url, config)

    if (response.status === 401) {
      // Clear token and redirect to login if unhandled
      tokenStorage.clear()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error.message || 'Network error occurred', 0, null)
  }
}
