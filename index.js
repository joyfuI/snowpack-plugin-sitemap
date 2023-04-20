const fs = require('fs');
const zlib = require('zlib');
const stream = require('stream');
const util = require('util');

const globby = require('globby');

module.exports = function (snowpackConfig, pluginOptions) {
  const {
    publicUrl = process.env.PUBLIC_URL || snowpackConfig.buildOptions.baseUrl,
    exclude = [],
    gzip = false,
    changefreq,
    trailingSlash = false,
  } = pluginOptions;

  return {
    name: 'snowpack-plugin-sitemap',
    async optimize({ buildDirectory }) {
      const path = buildDirectory.replace(/\\/g, '/'); // 윈도우와 호환성을 위해
      const pages = await globby(['**/*.{html,htm}', '!index.{html,htm}'], {
        cwd: path,
        ignore: exclude,
      });
      const baseUrl = publicUrl.replace(/\/$/, '');
      const today = new Date().toISOString();

      const urlSite = pages
        .map((page) => {
          const url = page.replace(/\/index.html?$/, trailingSlash ? '/' : '');
          return `
  <url>
    <loc>${baseUrl}/${url}</loc>
    <lastmod>${today}</lastmod>${
            changefreq
              ? `
    <changefreq>${changefreq}</changefreq>`
              : ''
          }
  </url>`;
        })
        .join('');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>${
        changefreq
          ? `
    <changefreq>${changefreq}</changefreq>`
          : ''
      }
  </url>${urlSite}
</urlset>
`;

      fs.writeFileSync(`${path}/sitemap.xml`, sitemap);

      if (gzip) {
        // sitemap.xml.gz 생성
        const pipe = util.promisify(stream.pipeline);
        const source = fs.createReadStream(`${path}/sitemap.xml`);
        const zlibGzip = zlib.createGzip();
        const destination = fs.createWriteStream(`${path}/sitemap.xml.gz`);
        await pipe(source, zlibGzip, destination);

        fs.unlinkSync(`${path}/sitemap.xml`);
      }
    },
  };
};
