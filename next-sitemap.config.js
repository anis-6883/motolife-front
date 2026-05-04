/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.stampezee.com",
  exclude: ["/manifest.webmanifest", "/admin/*", "/seller/*", "/root-lab/admin/login"],
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  additionalPaths: async () => [
    { loc: "/", changefreq: "monthly", priority: 1 },
    // { loc: '/pricing', changefreq: 'monthly', priority: 1 },
    { loc: "/contact-us", changefreq: "monthly", priority: 0.8 },
    { loc: "/faqs", changefreq: "monthly", priority: 0.7 },
    // { loc: '/retailer/login', changefreq: 'monthly', priority: 0.6 },
  ],
};
