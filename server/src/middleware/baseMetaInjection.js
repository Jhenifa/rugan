import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGE_META = {
  "/": {
    title: "The Rural Girl-Child Advancement Network (RUGAN) | Empowering Rural Girls",
    description: "The Rural Girl-Child Advancement Network (RUGAN) empowers rural girls in Nigeria through quality education, menstrual health dignity, mentorship, advocacy, and leadership development."
  },
  "/about": {
    title: "About Us | The Rural Girl-Child Advancement Network",
    description: "Learn about RUGAN's mission to empower rural girl-children in Nigeria through education, advocacy, and leadership development."
  },
  "/team": {
    title: "Our Team | The Rural Girl-Child Advancement Network",
    description: "Meet the dedicated team behind RUGAN, working to transform the lives of rural girls across Nigeria."
  },
  "/programmes": {
    title: "Our Programmes | The Rural Girl-Child Advancement Network",
    description: "Explore our initiatives in education, menstrual health, mentorship, and leadership development for rural girls."
  },
  "/impact": {
    title: "Our Impact | The Rural Girl-Child Advancement Network",
    description: "Discover the measurable difference RUGAN is making in the lives of rural girls and their communities."
  },
  "/volunteers": {
    title: "Volunteer With Us | The Rural Girl-Child Advancement Network",
    description: "Join our network of volunteers and help us empower the next generation of rural female leaders in Nigeria."
  },
  "/partnership": {
    title: "Partner With Us | The Rural Girl-Child Advancement Network",
    description: "Collaborate with RUGAN to scale our impact and reach more rural girl-children with life-changing opportunities."
  },
  "/blog": {
    title: "Blog & Updates | The Rural Girl-Child Advancement Network",
    description: "Stay updated with the latest news, stories, and insights from RUGAN's work in rural Nigerian communities."
  },
  "/donate": {
    title: "Support Our Cause | The Rural Girl-Child Advancement Network",
    description: "Your donation helps us provide education, menstrual health support, and mentorship to rural girls in Nigeria."
  }
};

export async function injectBaseMeta(req, res, next) {
  // Only target primary pages and only for GET requests
  const pathName = req.path.replace(/\/+$/, "") || "/";
  const meta = PAGE_META[pathName];

  if (req.method !== "GET" || !meta) {
    return next();
  }

  try {
    const indexPath = path.resolve(__dirname, "../../../client/dist/index.html");
    
    let html;
    try {
      html = await fs.readFile(indexPath, "utf8");
    } catch (err) {
      // If index.html is missing, just skip
      return next();
    }

    const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
    const absoluteImageUrl = `${siteUrl}/images/homepage/Hero.jpg`;

    // Inject tags into <head>
    html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
    
    // Replace meta description if it exists, otherwise add it
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${meta.description}" />`);
    } else {
      html = html.replace("</head>", `  <meta name="description" content="${meta.description}" />\n  </head>`);
    }

    // Add/Update OG and Twitter tags
    const metaTags = `
    <!-- Dynamic Meta Tags (Injected) -->
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${absoluteImageUrl}" />
    <meta property="og:url" content="${siteUrl}${pathName}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${absoluteImageUrl}" />
    `;

    // Remove existing injected tags if any (to avoid duplicates)
    html = html.replace(/<!-- Dynamic Meta Tags \(Injected\) -->[\s\S]*?<!-- End Dynamic Meta Tags -->/g, "");
    
    html = html.replace("</head>", `${metaTags}\n    <!-- End Dynamic Meta Tags -->\n  </head>`);

    res.send(html);
  } catch (error) {
    console.error("Base meta injection error:", error);
    next();
  }
}
