export function resizePosterUrl(
  url: string | null,
  size: "w200" | "w300" | "w500",
): string | null {
  if (!url) return null;
  return url.replace("/w500/", `/${size}/`);
}
