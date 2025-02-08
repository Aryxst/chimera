import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const releases = await getCollection("releases");
export const pages = Object.fromEntries(releases.map(page => [page.id, page.data]));
export type PageData = (typeof pages)[keyof typeof pages];

export const { getStaticPaths, GET } = OGImageRoute({
  param: "slug",
  pages,
  getImageOptions: (_path, page: PageData) => ({
    title: page.versionNumber,
    bgGradient: [
      [58, 8, 78],
      [91, 14, 129],
      [188, 76, 155],
      [223, 127, 79],
    ],
    font: {
      title: {
        size: 78,
        families: ["Lato Extra Bold"],
        weight: "ExtraBold",
      },
    },
    padding: 250,
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-700-normal.woff2",
    ],
  }),
});
