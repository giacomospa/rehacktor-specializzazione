// src/pages/login/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../supabase/supabase-client'
import { LoginSchema, getErrors } from '../../lib/validationForm'

export default function LoginPage() {
  const navigate = useNavigate()
  
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))

    // Validazione in tempo reale solo se il form è stato già submitato
    if (formSubmitted) {
      const { error } = LoginSchema.safeParse({
        ...formState,
        [name]: value
      })
      
      if (error) {
        const errors = getErrors(error)
        setFormErrors(errors)
      } else {
        setFormErrors({})
      }
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setFormSubmitted(true)
    
    const { error, data } = LoginSchema.safeParse(formState)
    
    if (error) {
      const errors = getErrors(error)
      setFormErrors(errors)
      console.log(errors)
    } else {
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })
      
      if (signInError) {
        alert("Login error 👎🏻!")
        console.error(signInError)
      } else {
        alert("Logged in 👍🏻!")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        navigate("/")
      }
    }
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card bg-transparent border-0 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 text-light">Login</h2>
          
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-light">
                Email
              </label>
              <input
                type="email"
                className="form-control bg-transparent border-light text-light"
                id="email"
                name="email"
                value={formState.email}
                onChange={onChange}
                placeholder="Inserisci la tua email"
                required
              />
              {formErrors.email && (
                <small className="text-danger">{formErrors.email}</small>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-light">
                Password
              </label>
              <input
                type="password"
                className="form-control bg-transparent border-light text-light"
                id="password"
                name="password"
                value={formState.password}
                onChange={onChange}
                placeholder="Inserisci la tua password"
                required
              />
              {formErrors.password && (
                <small className="text-danger">{formErrors.password}</small>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-details btn-md"
              >
                Accedi
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-light">
              Non hai un account?{' '}
              <a href="/register" className="text-primary text-decoration-none">
                Registrati qui
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}