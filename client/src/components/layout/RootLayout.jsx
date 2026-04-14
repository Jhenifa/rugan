import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
