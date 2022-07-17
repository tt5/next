import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (email, password) => {
    try {
      setLoading(true)
      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      alert('ok')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { user, session, error } = await supabase.auth.signIn({
        email,
        password,
      })
      if (error) throw error
      alert('ok')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <p className="description">Sign up</p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSignup(email, password)
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'sign up'}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email, password)
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'log in'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
