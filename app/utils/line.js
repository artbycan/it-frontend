const CHANNEL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN;

export const sendLineMessage = async (userId, message) => {
  try {
    const response = await fetch('/api/line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        message
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send LINE message');
    }

    console.log('LINE API Response:', result);
    return { success: true, result };
  } catch (error) {
    console.error('LINE Message Error:', error);
    throw error;
  }
};