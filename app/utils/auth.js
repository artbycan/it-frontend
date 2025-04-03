export async function logout() {
  try {
    // Clear session on server
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear all localStorage items
    localStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token')
  }
  return null
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  }
}