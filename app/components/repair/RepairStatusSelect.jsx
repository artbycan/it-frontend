'use client'
import { useState } from 'react'
import { REPAIR_STATUS, getStatusLabel, getStatusColor } from '@/app/components/repair/RepairStatus'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function RepairStatusSelect({ 
  requestId, 
  value, 
  onUpdate,
  disabled = false 
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await fetch(`${API_ENDPOINTS.maintenance.update}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request_id: requestId,
          request_status: parseInt(newStatus)
        })
      })

      const result = await response.json()

      if (result.status === 200) {
        onUpdate?.(result.data)
      } else {
        throw new Error(result.message || 'Failed to update status')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
        {getStatusLabel(value)}
      </span>
      
      <select
        value={value}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={disabled || isUpdating}
        className="px-2 py-1 text-sm border rounded-lg bg-white disabled:bg-gray-100"
      >
        {REPAIR_STATUS.map(status => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>

      {isUpdating && (
        <span className="text-sm text-gray-500">กำลังอัพเดท...</span>
      )}
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
}