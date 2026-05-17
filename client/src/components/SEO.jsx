import { Helmet } from "react-helmet-async";
import { buildSeoPayload } from "@/seo/meta";
import { SITE_LANGUAGE, SITE_NAME } from "@/seo/site";

function toJsonLdGraph(graph) {
  const normalizedGraph = graph
    .filter(Boolean)
    .map((item) => {
      const { "@context": _context, ...rest } = item;
      return rest;
    });

  return {
    "@context": "https://schema.org",
    "@graph": normalizedGraph,
  };
}

export default function SEO(props) {
  const payload = buildSeoPayload(props);
  const graph = toJsonLdGraph(payload.graph);

  return (
    <Helmet prioritizeSeoTags>
      <html lang={SITE_LANGUAGE} />
      <title>{payload.pageTitle}</title>
      <meta name="description" content={payload.pageDescription} />
      <meta name="robots" content={payload.robots} />
      <meta name="googlebot" content={payload.robots} />
      <meta name="bingbot" content={payload.robots} />
      <meta name="author" content={payload.author || SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta
        name="keywords"
        content={payload.keywords || "girls education, rural empowerment, nonprofit Nigeria"}
      />

      <link rel="canonical" href={payload.canonicalUrl} />
      <link rel="alternate" hrefLang="en-NG" href={payload.canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={payload.canonicalUrl} />
      <link rel="image_src" href={payload.imageUrl} />

      <meta property="og:site_name" content={payload.siteName} />
      <meta property="og:locale" content={payload.locale} />
      <meta property="og:type" content={payload.type} />
      <meta property="og:title" content={payload.pageTitle} />
      <meta property="og:description" content={payload.pageDescription} />
      <meta property="og:url" content={payload.canonicalUrl} />
      <meta property="og:image" content={payload.imageUrl} />
      <meta property="og:image:secure_url" content={payload.imageUrl} />
      <meta property="og:image:alt" content={payload.imageAlt} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={payload.pageTitle} />
      <meta name="twitter:description" content={payload.pageDescription} />
      <meta name="twitter:image" content={payload.imageUrl} />
      <meta name="twitter:image:alt" content={payload.imageAlt} />

      {payload.type === "article" && payload.author ? (
        <meta property="article:author" content={payload.author} />
      ) : null}
      {payload.type === "article" && payload.section ? (
        <meta property="article:section" content={payload.section} />
      ) : null}
      {payload.publishedTimeIso ? (
        <meta
          property="article:published_time"
          content={payload.publishedTimeIso}
        />
      ) : null}
      {payload.modifiedTimeIso ? (
        <meta property="article:modified_time" content={payload.modifiedTimeIso} />
      ) : null}
      {payload.modifiedTimeIso ? (
        <meta property="og:updated_time" content={payload.modifiedTimeIso} />
      ) : null}
      {payload.articleTags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
}
