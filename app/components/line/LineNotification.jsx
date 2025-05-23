'use client'
import { sendLineMessage } from '@/app/utils/line'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import { REPAIR_STATUS, getStatusLabel, getStatusColor } from '@/app/components/repair/RepairStatus'

export const sendRepairStatusNotification = async (requestId, userData, newStatus) => {
  try {
    if (!userData?.data?.line_id) {
      console.log('No LINE ID available for this user');
      return;
    }

    const nstatus = REPAIR_STATUS.find(s => s.id == parseInt(newStatus))?.name;
    const message = `แจ้งสถานะการซ่อม #${requestId}
สถานะได้เปลี่ยนเป็น: ${nstatus}
หมายเลขครุภัณฑ์: ${userData.data.assets_num}
ชื่อครุภัณฑ์: ${userData.data.assets_name}
ชื่อ-สกุลผู้แจ้ง: ${userData.data.f_name} ${userData.data.l_name}
ชื่อ-สกุลช่างเทคนิค: ${userData.data.technician_fname} ${userData.data.technician_lname}
เบอร์โทรช่าง: ${userData.data.technician_phone}`;

    await sendLineMessage(userData.data.line_id, message);
    //console.log('Sending LINE message:', message);
    console.log('LINE notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send LINE notification:', error);
    return false;
  }
};

export const getUserLineId = async (requestId) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.maintenance.getById}/${requestId}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to get user LINE ID:', error);
    throw error;
  }
};