// robots.js
const fs = require("fs");

const generatedSitemap = `
User-agent: *
`;

fs.writeFileSync("../public/robots.txt", generatedSitemap, "utf8");
