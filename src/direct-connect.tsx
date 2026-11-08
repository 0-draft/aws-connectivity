import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import DirectConnectApp from "./app/DirectConnectApp";
import { LangProvider } from "./i18n/LangContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider
      title={{
        en: "Direct Connect, up close — On-ramp",
        ja: "Direct Connect を深掘り — On-ramp",
      }}
    >
      <DirectConnectApp />
    </LangProvider>
  </StrictMode>,
);
