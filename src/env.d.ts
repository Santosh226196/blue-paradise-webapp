/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference types="vite/client" />

declare module "@tailwindcss/vite" {
  const tailwindcss: any;
  export default tailwindcss;
}
