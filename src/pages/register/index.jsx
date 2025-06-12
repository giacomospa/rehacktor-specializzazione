// src/pages/register/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../supabase/supabase-client'
import { ConfirmSchema, getErrors } from '../../lib/validationForm'

export default function RegisterPage() {
  const navigate = useNavigate()
  
  const [formState, setFormState] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
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
      const { error } = ConfirmSchema.safeParse({
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
    
    const { error, data } = ConfirmSchema.safeParse(formState)
    
    if (error) {
      const errors = getErrors(error)
      setFormErrors(errors)
      console.log(errors)
    } else {
      let { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username
          }
        }
      })
      
      if (signUpError) {
        alert("Signing up error 👎🏻!")
        console.error(signUpError)
      } else {
        alert("Signed up 👍🏻!")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        navigate("/")
      }
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-transparent border-0 shadow-lg">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4 fw-bold text-white">Registrazione</h2>
              
              <form onSubmit={onSubmit} className='text-white'>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">Nome</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={onChange}
                      className={`form-control bg-transparent text-white ${formErrors.firstName ? 'is-invalid' : ''}`}
                      required
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback">{formErrors.firstName}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Cognome</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={onChange}
                      className={`form-control bg-transparent text-white  ${formErrors.lastName ? 'is-invalid' : ''}`}
                      required
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback">{formErrors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={onChange}
                    className={`form-control bg-transparent text-white ${formErrors.email ? 'is-invalid' : ''}`}
                    required
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formState.username}
                    onChange={onChange}
                    className={`form-control bg-transparent text-white  ${formErrors.username ? 'is-invalid' : ''}`}
                    required
                  />
                  {formErrors.username && (
                    <div className="invalid-feedback">{formErrors.username}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formState.password}
                    onChange={onChange}
                    className={`form-control bg-transparent text-white  ${formErrors.password ? 'is-invalid' : ''}`}
                    required
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">{formErrors.password}</div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-details btn-md"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Registrati
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Hai già un account? 
                  <a href="/login" className="text-decoration-none ms-1 text-info">Accedi qui</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}