export const API_BASE_URL = 'http://localhost:8087'

export const API_ENDPOINTS = {
  main: `${API_BASE_URL}`,
  departments: {
    getAll: `${API_BASE_URL}/departments/get`,
    create: `${API_BASE_URL}/departments/add`,
    update: `${API_BASE_URL}/departments/update`,
    delete: `${API_BASE_URL}/departments/delete`,
    getById: `${API_BASE_URL}/departments/getid`,
  },
  auth: {
    login: `${API_BASE_URL}/user/login`
  },
  users:{
    getAll: `${API_BASE_URL}/users/get`,
    create: `${API_BASE_URL}/users/add`,
    update: `${API_BASE_URL}/users/update`,
    delete: `${API_BASE_URL}/users/delete`,
    getById: `${API_BASE_URL}/users/getid`,
    getRoles: `${API_BASE_URL}/users/roles`,
  },
  assettypes: {
    getAll: `${API_BASE_URL}/assettypes/get`,
    getById: `${API_BASE_URL}/assettypes/getid`,
    create: `${API_BASE_URL}/assettypes/add`,
    update: `${API_BASE_URL}/assettypes/update`,
    delete: `${API_BASE_URL}/assettypes/delete`,
  },
  assetbrands: {
    getAll: `${API_BASE_URL}/assetbrands/get`,
    getById: `${API_BASE_URL}/assetbrands/getid`,
    create: `${API_BASE_URL}/assetbrands/add`,
    update: `${API_BASE_URL}/assetbrands/update`,
    delete: `${API_BASE_URL}/assetbrands/delete`,
  },
  assetmodels: {
    getAll: `${API_BASE_URL}/assetmodels/get`,
    getById: `${API_BASE_URL}/assetmodels/getid`,
    create: `${API_BASE_URL}/assetmodels/add`,
    update: `${API_BASE_URL}/assetmodels/update`,
    delete: `${API_BASE_URL}/assetmodels/delete`,
  },
  files: {
    getRange: `${API_BASE_URL}/files/range`,
    count: `${API_BASE_URL}/files/count`,
    upLoad: `${API_BASE_URL}/uploadfiles`,
    get: `${API_BASE_URL}/file`,
  },
  assets: {
    getRange: `${API_BASE_URL}/assets/get`,
    add: `${API_BASE_URL}/assets/add`,
  }
  // Add more endpoint categories here as needed
}