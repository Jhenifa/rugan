export function getPostAuthorName(post) {
  if (!post) return "";

  if (typeof post.author === "string") {
    return post.author;
  }

  if (post.author && typeof post.author === "object") {
    return post.author.name || post.author.fullName || "";
  }

  return post.authorName || "";
}

export function formatPostDate(postOrDate) {
  const rawDate =
    typeof postOrDate === "string"
      ? postOrDate
      : postOrDate?.publishedAt || postOrDate?.createdAt || postOrDate?.date;

  if (!rawDate) return "";

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return typeof rawDate === "string" ? rawDate : "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getPostImage(post) {
  return post?.coverImage || post?.image || "/images/blog/hero.jpg";
}
