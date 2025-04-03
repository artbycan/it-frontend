import 'iron-session'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string
      username: string
      role: string
      status: string
      fullName: string
    }
    token?: string
  }
}