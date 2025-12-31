/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/tokenburner",
        destination: "https://www.soltokenburner.com/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
