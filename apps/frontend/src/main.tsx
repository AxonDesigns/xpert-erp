import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@frontend/fonts/Supreme/css/supreme.css";
import { ThemeProvider } from "@frontend/hooks/theme";
import App from "@frontend/app";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Draggable from "gsap/Draggable";
import CustomEase from "gsap/CustomEase";
import CustomWiggle from "gsap/CustomWiggle";

gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(CustomEase, CustomWiggle);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
