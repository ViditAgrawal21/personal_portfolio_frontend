'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api';

export default function APITestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [token, setToken] = useState<string>('');

  const testEndpoint = async (name: string, fn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await fn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error: any) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.response?.data || error.message || 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testLogin = () => testEndpoint('login', async () => {
    const response = await apiClient.post(API_ROUTES.ADMIN.LOGIN, {
      email: 'agrawalvidit656@gmail.com',
      password: 'Vidit@123'
    });
    if (response.data.data?.token) {
      setToken(response.data.data.token);
      localStorage.setItem('adminToken', response.data.data.token);
    }
    return response.data;
  });

  const testStats = () => testEndpoint('stats', async () => {
    const response = await apiClient.get(API_ROUTES.ADMIN.STATS);
    return response.data;
  });

  const testInquiries = () => testEndpoint('inquiries', async () => {
    const response = await apiClient.get(`${API_ROUTES.ADMIN.INQUIRIES}?page=1&limit=5`);
    return response.data;
  });

  const testHireRequests = () => testEndpoint('hireRequests', async () => {
    const response = await apiClient.get(`${API_ROUTES.ADMIN.HIRE_REQUESTS}?page=1&limit=5`);
    return response.data;
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tests</h1>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Current token: {token ? '✅ Set' : '❌ Not set'}
        </p>
      </div>

      <div className="grid gap-4">
        {/* Login Test */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Login Test</h2>
            <button
              onClick={testLogin}
              disabled={loading.login}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {loading.login ? 'Testing...' : 'Test Login'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Endpoint: POST /api/proxy/admin/login
          </p>
          {results.login && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              <pre>{JSON.stringify(results.login, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Stats Test */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Stats Test</h2>
            <button
              onClick={testStats}
              disabled={loading.stats || !token}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {loading.stats ? 'Testing...' : 'Test Stats'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Endpoint: GET /api/proxy/admin/stats
          </p>
          {results.stats && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              <pre>{JSON.stringify(results.stats, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Inquiries Test */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Inquiries Test</h2>
            <button
              onClick={testInquiries}
              disabled={loading.inquiries || !token}
              className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
            >
              {loading.inquiries ? 'Testing...' : 'Test Inquiries'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Endpoint: GET /api/proxy/admin/inquiries?page=1&limit=5
          </p>
          {results.inquiries && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              <pre>{JSON.stringify(results.inquiries, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Hire Requests Test */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Hire Requests Test</h2>
            <button
              onClick={testHireRequests}
              disabled={loading.hireRequests || !token}
              className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
            >
              {loading.hireRequests ? 'Testing...' : 'Test Hire Requests'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Endpoint: GET /api/proxy/admin/hire-requests?page=1&limit=5
          </p>
          {results.hireRequests && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              <pre>{JSON.stringify(results.hireRequests, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Instructions:</h3>
        <ol className="list-decimal list-inside mt-2 text-sm text-yellow-700">
          <li>First, test the Login endpoint to get a JWT token</li>
          <li>Once logged in successfully, test the other endpoints</li>
          <li>Check the browser console for detailed logs from the proxy</li>
          <li>All endpoints should return successful responses once authenticated</li>
        </ol>
      </div>
    </div>
  );
}