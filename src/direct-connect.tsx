import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import DirectConnectApp from "./app/DirectConnectApp";
import { LangProvider } from "./i18n/LangContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider
      title={{
        en: "Direct Connect, up close — AWS Connectivity",
        ja: "Direct Connect を深掘り — AWS Connectivity",
      }}
    >
      <DirectConnectApp />
    </LangProvider>
  </StrictMode>,
);
