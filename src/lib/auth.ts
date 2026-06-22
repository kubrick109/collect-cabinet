export interface AuthUser {
  id: string
  username: string
  displayName: string
}

interface StoredUser extends AuthUser {
  password: string
}

const USERS_KEY = 'collect-cabinet-users-v1'
const SESSION_KEY = 'collect-cabinet-session-v1'

export function getCurrentUser(): AuthUser | null {
  const sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) return null
  const user = loadUsers().find((candidate) => candidate.id === sessionId)
  if (!user) return null
  return toAuthUser(user)
}

export function registerUser(username: string, password: string): AuthUser {
  const normalized = normalizeUsername(username)
  if (normalized.length < 3) {
    throw new Error('Username must be at least 3 characters')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const users = loadUsers()
  if (users.some((user) => user.username === normalized)) {
    throw new Error('That username is already registered')
  }

  const user: StoredUser = {
    id: createUserId(),
    username: normalized,
    displayName: normalized,
    password,
  }
  saveUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.id)
  return toAuthUser(user)
}

export function loginUser(username: string, password: string): AuthUser {
  const normalized = normalizeUsername(username)
  const user = loadUsers().find((candidate) => candidate.username === normalized)
  if (!user || user.password !== password) {
    throw new Error('Incorrect username or password')
  }
  localStorage.setItem(SESSION_KEY, user.id)
  return toAuthUser(user)
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY)
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  }
}

function createUserId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
