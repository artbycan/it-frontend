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
    update: `${API_BASE_URL}/assets/update`,
    delete: `${API_BASE_URL}/assets/delete`,
    getById: `${API_BASE_URL}/assets/getid`,
    getฺByname: `${API_BASE_URL}/assets/getname`,
    getCount: `${API_BASE_URL}/assets/count`,
    getByStatus: `${API_BASE_URL}/assets/getstatus`,
  },
  maintenance: {
    getByUser: `${API_BASE_URL}/maintenance/getbyuser`,
    getById: `${API_BASE_URL}/maintenance/getid`,
    getAll: `${API_BASE_URL}/maintenance/get`,
    create: `${API_BASE_URL}/maintenance/add`,
    update: `${API_BASE_URL}/maintenance/update`,
    delete: `${API_BASE_URL}/maintenance/delete`,
    getByTechnician: `${API_BASE_URL}/maintenance/getbytechnician`,
  },
  task: {
    assignTaskRandom: `${API_BASE_URL}/task/assign_task_random`,
  },
  maintenance_log: {
    add: `${API_BASE_URL}/maintenance_log/add`,
    getByRequest: `${API_BASE_URL}/maintenance_log/getbyrequest`,
    getById: `${API_BASE_URL}/maintenance_log/getid`,
    getAll: `${API_BASE_URL}/maintenance_log/get`,
  },
  stock_levels: {
    getAll: `${API_BASE_URL}/stock_levels/get`,
    getById: `${API_BASE_URL}/stock_levels/getid`,
    create: `${API_BASE_URL}/stock_levels/add`,
    update: `${API_BASE_URL}/stock_levels/update`,
    delete: `${API_BASE_URL}/stock_levels/delete`,
    stockAdd: `${API_BASE_URL}/stock-add/add`,
  },
  // Add more endpoint categories here as needed
}