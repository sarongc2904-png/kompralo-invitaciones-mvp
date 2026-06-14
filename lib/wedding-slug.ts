export function generateWeddingSlug(nombre1: string, nombre2: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z]/g, "")
      .slice(0, 8)
  const rand = Math.random().toString(36).slice(2, 6)
  return `${clean(nombre1)}-y-${clean(nombre2)}-${rand}`
}
