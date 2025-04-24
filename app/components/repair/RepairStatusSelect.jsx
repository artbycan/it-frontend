'use client'
import { useState } from 'react'
import { REPAIR_STATUS, getStatusLabel, getStatusColor } from '@/app/components/repair/RepairStatus'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import { sendLineNotification } from '@/app/utils/line'

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

      // Get user LINE ID first
      const userResponse = await fetch(`${API_ENDPOINTS.maintenance.getUser}/${requestId}`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      const userData = await userResponse.json();

      if (!userData.data?.line_id) {
        console.warn('No LINE ID found for this user');
      }

      // Update status
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
      });

      const result = await response.json();

      if (result.status === 200) {
        // Send LINE notification if we have a LINE ID
        if (userData.data?.line_id) {
          const status = REPAIR_STATUS.find(s => s.id === newStatus)?.name;
          await sendLineNotification(userData.data.line_id, status);
        }
        
        onUpdate?.(result.data);
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
    } catch (error) {
      setError(error.message);
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
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