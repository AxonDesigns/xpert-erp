import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@frontend/fonts/Supreme/css/supreme.css";
import { ThemeProvider } from "@frontend/hooks/theme";
import App from "@frontend/app";
import { AuthProvider } from "@frontend/hooks/useAuth";
import gsap from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
