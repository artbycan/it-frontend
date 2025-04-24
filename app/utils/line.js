export const sendLineNotification = async (userId, status) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.line.sendNotification}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        user_id: userId,
        message: `แจ้งสถานะการซ่อม: ${status}`
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending LINE notification:', error);
    throw error;
  }
};