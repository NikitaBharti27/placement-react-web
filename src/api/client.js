import { tokenStorage } from '../utils/tokenStorage'

const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim()

/**
 * True only when a backend URL is explicitly configured via VITE_API_URL.
 * When unset in standalone frontend development, services skip doomed network
 * calls so the browser console stays clean of ERR_CONNECTION_REFUSED errors.
 */
export const isLiveApiConfigured = Boolean(RAW_API_URL)
export const BASE_URL = (RAW_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Determine whether an API failure should fall back to local mock simulation.
 * Never swallows real 4xx/5xx server validation or auth rejections.
 */
export const shouldUseMockFallback = (error) => {
  if (!isLiveApiConfigured) return true
  const allowFallback = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false'
  return allowFallback && error?.status === 0
}

/**
 * Standard HTTP client with automatic Authorization header injection,
 * X-Tenant-Id multi-tenant context, timeout protection, and 401 interception.
 */
export const apiClient = async (endpoint, options = {}) => {
  if (!isLiveApiConfigured && !endpoint.startsWith('http')) {
    throw new ApiError('Standalone dev mode: no VITE_API_URL configured', 0, null)
  }

  const token = tokenStorage.getToken()
  const tenantId = tokenStorage.getTenantId()
  const { timeoutMs = 10000, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    ...fetchOptions.headers,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal,
    })

    if (response.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data,
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    const message =
      error?.name === 'AbortError'
        ? 'Request timed out while contacting PlacePrep server'
        : error?.message || 'Network error occurred'
    throw new ApiError(message, 0, null)
  } finally {
    clearTimeout(timeoutId)
  }
}
