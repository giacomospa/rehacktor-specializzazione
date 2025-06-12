// src/lib/validationForm.js
import { z } from 'zod'

// Schema per la registrazione
export const ConfirmSchema = z.object({
  email: z.string().email({ message: "Email non valida" }),
  firstName: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  lastName: z.string().min(2, { message: "Il cognome deve avere almeno 2 caratteri" }),
  username: z.string().min(3, { message: "L'username deve avere almeno 3 caratteri" }),
  password: z.string().min(6, { message: "La password deve avere almeno 6 caratteri" })
})

// Schema per il login
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email non valida" }),
  password: z.string().min(6, { message: "La password deve avere almeno 6 caratteri" })
})

// Funzione per estrarre gli errori di validazione
export const getErrors = (error) => {
  const errors = {}
  error.errors.forEach((err) => {
    const path = err.path[0]
    errors[path] = err.message
  })
  return errors
}