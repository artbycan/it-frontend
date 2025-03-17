'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { API_ENDPOINTS } from '../../config/api'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [formData, setFormData] = useState({
    departments_name: '',
    department_description: ''
  })

  // Fetch departments
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.departments.getAll)
      const result = await response.json()
      if (result.status === 200) {
        setDepartments(result.data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleAdd = () => {
    setSelectedDepartment(null)
    setFormData({ departments_name: '', department_description: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (department) => {
    setSelectedDepartment(department)
    setFormData({
      departments_name: department.departments_name,
      department_description: department.department_description
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('คุณต้องการลบแผนกนี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.departments.delete}/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchDepartments()
        }
      } catch (error) {
        console.error('Error deleting department:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = selectedDepartment
        ? `${API_ENDPOINTS.departments.update}/${selectedDepartment.departments_id}`
        : API_ENDPOINTS.departments.create
      const method = selectedDepartment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsModalOpen(false)
        fetchDepartments()
      }
    } catch (error) {
      console.error('Error saving department:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลแผนก</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            เพิ่มแผนก
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสแผนก</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อแผนก</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายละเอียด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((department) => (
                <tr key={department.departments_id}>
                  <td className="px-6 py-4">{department.departments_id}</td>
                  <td className="px-6 py-4">{department.departments_name}</td>
                  <td className="px-6 py-4">{department.department_description}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(department.departments_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {selectedDepartment ? 'แก้ไขแผนก' : 'เพิ่มแผนก'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">ชื่อแผนก</label>
                  <input
                    type="text"
                    value={formData.departments_name}
                    onChange={(e) => setFormData({ ...formData, departments_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                  <textarea
                    value={formData.department_description}
                    onChange={(e) => setFormData({ ...formData, department_description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}