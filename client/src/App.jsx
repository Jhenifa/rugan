import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import router from './router'
import './styles/globals.css'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
