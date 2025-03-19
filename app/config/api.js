//export const API_BASE_URL = 'http://localhost:8087'

export const API_ENDPOINTS = {
  departments: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}/departments/get`,
    create: `${process.env.NEXT_PUBLIC_API_URL}/departments/add`,
    update: `${process.env.NEXT_PUBLIC_API_URL}/departments/update`,
    delete: `${process.env.NEXT_PUBLIC_API_URLL}/departments/delete`,
    getById: `${process.env.NEXT_PUBLIC_API_URL}/departments/getid`,
  },
  auth: {
    login: `${process.env.NEXT_PUBLIC_API_URL}/user/login`
  },
  assettypes: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}/assettypes/get`,
    getById: `${process.env.NEXT_PUBLIC_API_URL}/assettypes/getid`,
    create: `${process.env.NEXT_PUBLIC_API_URL}/assettypes/add`,
    update: `${process.env.NEXT_PUBLIC_API_URL}/assettypes/update`,
    delete: `${process.env.NEXT_PUBLIC_API_URL}/assettypes/delete`,
  },
  assetbrands: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}/assetbrands/get`,
    getById: `${process.env.NEXT_PUBLIC_API_URL}/assetbrands/getid`,
    create: `${process.env.NEXT_PUBLIC_API_URL}/assetbrands/add`,
    update: `${process.env.NEXT_PUBLIC_API_URL}/assetbrands/update`,
    delete: `${process.env.NEXT_PUBLIC_API_URL}/assetbrands/delete`,
  },
  assetmodels: {
    getAll: `${process.env.NEXT_PUBLIC_API_URL}/assetmodels/get`,
    getById: `${process.env.NEXT_PUBLIC_API_URL}/assetmodels/getid`,
    create: `${process.env.NEXT_PUBLIC_API_URL}/assetmodels/add`,
    update: `${process.env.NEXT_PUBLIC_API_URL}/assetmodels/update`,
    delete: `${process.env.NEXT_PUBLIC_API_URL}/assetmodels/delete`,
  },
  files: {
    getRange: `${process.env.NEXT_PUBLIC_API_URL}/files/range`,
    count: `${process.env.NEXT_PUBLIC_API_URL}/files/count`,
  }
  // Add more endpoint categories here as needed
}