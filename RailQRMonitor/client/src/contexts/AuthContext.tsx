import { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'vendor' | 'railway_official'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock storage - in real app this would be a proper database
const STORAGE_KEY = 'railway_qr_users'
const SESSION_KEY = 'railway_qr_session'

function getStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function getStoredSession(): User | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app start
    const session = getStoredSession()
    setUser(session)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = getStoredUsers()
    const foundUser = users.find(u => u.email === email)
    
    if (!foundUser) {
      setIsLoading(false)
      return { success: false, error: 'User not found' }
    }
    
    // Basic password validation for demo
    if (password.length < 6) {
      setIsLoading(false)
      return { success: false, error: 'Invalid password' }
    }
    
    setUser(foundUser)
    saveSession(foundUser)
    setIsLoading(false)
    return { success: true }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = getStoredUsers()
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      setIsLoading(false)
      return { success: false, error: 'User already exists with this email' }
    }
    
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    saveUsers(users)
    
    setUser(newUser)
    saveSession(newUser)
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    saveSession(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}