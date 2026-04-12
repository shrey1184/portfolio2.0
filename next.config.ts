import type { NextConfig } from "next";

const getSupabaseHostname = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const supabaseHostname = getSupabaseHostname();

const nextConfig: NextConfig = {
  images: supabaseHostname
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
