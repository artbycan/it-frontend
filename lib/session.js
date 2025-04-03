import { getIronSession } from 'iron-session'

export const sessionOptions = {
  cookieName: "auth_session",
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 // 24 hours
  },
}

// Helper function to get session
export async function getServerSession(req, res) {
  return getIronSession(req, res, sessionOptions)
}