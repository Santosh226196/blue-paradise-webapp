import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export async function enableMocking() {
  if (import.meta.env.MODE !== "development") return;

  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
}
