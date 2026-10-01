import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { ToastProvider } from "./hooks/useToast.jsx";
import { AuthProvider } from "./modules/auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
