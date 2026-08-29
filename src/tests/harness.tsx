import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { render, type RenderOptions } from "@testing-library/react";
import { beforeEach, vi, type Mock } from "vitest";
import { ThemeProvider } from "@/hooks/useTheme";
import { ToastProvider } from "@/components/Toast";
import { makeStore } from "@/store";
import type { RootState } from "@/store";

type ApiHandler = (request: Request) => unknown;

const routeHandlers = new Map<string, ApiHandler>();

export function mockApi(pathIncludes: string, handlerOrData: ApiHandler | unknown) {
  const handler: ApiHandler =
    typeof handlerOrData === "function"
      ? (handlerOrData as ApiHandler)
      : () => handlerOrData;
  routeHandlers.set(pathIncludes, handler);
}

export function resetApiMocks() {
  routeHandlers.clear();
}

export function setupFetchMock() {
  const fetchMock: Mock = vi.fn(async (input: RequestInfo | URL) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : String(input);
    const req = input instanceof Request ? input : new Request(url);

    for (const [needle, handler] of routeHandlers) {
      if (url.includes(needle)) {
        const data = handler(req);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Default fallback: return an empty success response to avoid network errors.
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });

  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

export function createTestStore(preloaded?: Partial<RootState>) {
  return makeStore(preloaded as never);
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, initialEntries = ["/"], ...renderOptions }: RenderWithProvidersOptions = {}
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <ToastProvider>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </ToastProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function authenticatedState() {
  return {
    auth: { user: { username: "admin" }, token: "test-token", isAuthenticated: true },
  } as Partial<RootState>;
}

// Auto-install the fetch mock before each test that imports this harness.
beforeEach(() => {
  setupFetchMock();
});
