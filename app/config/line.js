export const LINE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_LINE_CLIENT_ID,
  redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI,
  scope: 'profile openid email'
}

export const getLineLoginUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINE_CONFIG.clientId,
    redirect_uri: LINE_CONFIG.redirectUri,
    scope: LINE_CONFIG.scope,
    state: 'line-login',
  })
  
  return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`
}