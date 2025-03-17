export const API_BASE_URL = 'http://localhost:8087'

export const API_ENDPOINTS = {
  assets: {
    getAll: `${API_BASE_URL}/assets/get`,
    // Add more asset-related endpoints here
  },
  departments: {
    getAll: `${API_BASE_URL}/departments/get`,
    create: `${API_BASE_URL}/departments/add`,
    update: `${API_BASE_URL}/departments/update`,
    delete: `${API_BASE_URL}/departments/delete`,
    getById: `${process.env.NEXT_PUBLIC_API_URL}/departments/getid`,
  },
  // Add more endpoint categories here as needed
}