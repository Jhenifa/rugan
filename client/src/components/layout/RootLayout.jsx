import { Outlet, ScrollRestoration } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Footer from './Footer'

export default function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
