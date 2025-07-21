import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@frontend/fonts/Supreme/css/supreme.css";
import { ThemeProvider } from "@frontend/hooks/theme";
import App from "@frontend/app";
import gsap from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
