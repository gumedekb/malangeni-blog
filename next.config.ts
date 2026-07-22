import type { NextConfig } from "next";

/**
 * Same-origin API proxy.
 *
 * The browser calls `/api/*` on this dev server, and Next forwards those
 * requests to the Spring backend. This means:
 *   - the browser never has to reach the backend host directly (handy when
 *     the backend runs on the Windows host and the app runs under WSL, where
 *     `localhost:8080` doesn't cross the boundary), and
 *   - there's no CORS, because from the browser it's all one origin.
 *
 * BACKEND_ORIGIN is a SERVER-side var (no NEXT_PUBLIC_ prefix): it only needs
 * to be reachable from wherever `next dev` runs. Under WSL that's the Windows
 * host IP (e.g. http://172.22.224.1:8080), not localhost.
 */
const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
