/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    webpack: (config) => {
        config.module.rules.push({
          test: /\.json$/,
          type: 'json',
        });
        return config;
      },
};

export default nextConfig;
