/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="vite/client" />

declare module "msw" {
  export const http: any;
  export const HttpResponse: any;
}

declare module "msw/browser" {
  export function setupWorker(...handlers: any[]): {
    start: (opts?: any) => Promise<void>;
    stop: () => void;
  };
}

declare module "msw/node" {
  export function setupServer(...handlers: any[]): {
    listen: (opts?: any) => void;
    close: () => void;
    resetHandlers: () => void;
  };
}

declare module "@tailwindcss/vite" {
  const tailwindcss: any;
  export default tailwindcss;
}
