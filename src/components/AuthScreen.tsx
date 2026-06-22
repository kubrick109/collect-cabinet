import { useState, type FormEvent } from 'react'

interface AuthScreenProps {
  onLogin: (username: string, password: string) => void
  onRegister: (username: string, password: string) => void
}

type Mode = 'login' | 'register'

export function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        onLogin(username, password)
      } else {
        onRegister(username, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="cabinet-grid-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cabinet-elevated text-2xl ring-1 ring-cabinet-border">
            ✦
          </span>
          <h1 className="mt-4 font-serif text-3xl font-semibold">My Collect Cabinet</h1>
          <p className="mt-2 text-sm text-cabinet-muted">
            Sign in to enter your private collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex rounded-xl border border-cabinet-border bg-cabinet-surface p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`flex-1 rounded-lg py-2 text-sm gold-ring ${
                mode === 'login'
                  ? 'bg-cabinet-gold font-semibold text-cabinet-bg'
                  : 'text-cabinet-muted'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`flex-1 rounded-lg py-2 text-sm gold-ring ${
                mode === 'register'
                  ? 'bg-cabinet-gold font-semibold text-cabinet-bg'
                  : 'text-cabinet-muted'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-cabinet-loss/40 bg-cabinet-loss/10 px-3 py-2 text-sm text-cabinet-loss">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="At least 3 characters"
                className="field-input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-cabinet-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="field-input"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-cabinet-gold py-2.5 text-sm font-semibold text-cabinet-bg gold-ring"
          >
            {mode === 'login' ? 'Enter Collection' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-cabinet-muted">
            Accounts are currently stored in this browser for local testing. Cloud accounts will be added before launch.
          </p>
        </form>
      </div>
    </div>
  )
}
