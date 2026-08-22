import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root")!;

async function boot() {
  if (import.meta.env.DEV) {
    try {
      const { enableMocking } = await import("./mocks/browser");
      await enableMocking();
    } catch (err) {
      console.warn("Mocking failed to start, running without mocks:", err);
    }
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

boot();
