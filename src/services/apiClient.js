/**
 * Placeholder API client. Not wired to any backend.
 * Replace `simulate()` calls with real fetch/axios once APIs are ready.
 */

const BASE_URL = "/api";

function simulate(data, delay = 400) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

export const apiClient = {
  get: (path, params) => simulate({ path, params }),
  post: (path, body) => simulate({ path, body }),
  put: (path, body) => simulate({ path, body }),
  delete: (path) => simulate({ path }),
  baseUrl: BASE_URL,
};

export default apiClient;
