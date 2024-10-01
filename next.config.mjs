// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"], // Ici tout domaine externe si nécessaire.
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Utilise @svgr/webpack pour les fichiers SVG
    });

    return config;
  },
};

export default nextConfig;
