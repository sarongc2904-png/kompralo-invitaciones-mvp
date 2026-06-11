export function resolveImageUrl(value: string | null | undefined) {
  const image = value?.trim();

  if (!image) {
    return "/templates/placeholder.jpg";
  }

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image;
  }

  if (/\.(jpg|jpeg|png|webp|gif|avif)$/i.test(image)) {
    return `/templates/${image}`;
  }

  return `/templates/${image}.jpg`;
}
