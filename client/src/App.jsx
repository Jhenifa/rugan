import { RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import OfflineBanner from '@/components/OfflineBanner'
import router from './router'
import './styles/globals.css'

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <OfflineBanner />
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
