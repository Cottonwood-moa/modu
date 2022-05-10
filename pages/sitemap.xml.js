import client from "@libs/server/client";

const generateSitemap = (data, origin) => {
  let xml = "";

  data.pages.map((page) => {
    xml += `<url>
      <loc>${origin + page.location}</loc>
      <lastmod>${page.lastMod}</lastmod>
    </url>`;
  });

  return ` <?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${xml}
    </urlset>`;
};
const getDate = new Date().toISOString();
export async function getServerSideProps({ res }) {
  const post = await client.post.findMany({
    select: {
      id: true,
    },
  });
  const postPaths = post?.map((path) => {
    return {
      location: `/post/${path.id}`,
      lastMod: getDate,
    };
  });
  const data = {
    pages: [
      {
        location: "/",
        lastMod: getDate,
      },
      ...postPaths,
    ],
  };
  res.setHeader("Content-Type", "text/xml");
  res.write(generateSitemap(data, "http://localhost:3000"));
  res.end();
  return {
    props: {},
  };
}

const SitemapIndex = () => null;
export default SitemapIndex;
