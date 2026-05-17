import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const staticShell = document.getElementById("seo-static-shell");

if (staticShell) {
  startTransition(() => {
    staticShell.remove();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
