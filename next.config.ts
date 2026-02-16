/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/tokenburner",
        destination: "https://www.soltokenburner.fun/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
