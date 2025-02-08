import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const releases = await getCollection("releases");
export const pages = Object.fromEntries(releases.map(page => [page.id, page.data]));
export type PageData = (typeof pages)[keyof typeof pages];

export const { getStaticPaths, GET } = OGImageRoute({
  param: "slug",
  pages,
  getImageOptions: (_path, page: PageData) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [58, 8, 78],
      [91, 14, 129],
      [188, 76, 155],
      [223, 127, 79],
    ],
    font: {
      title: {
        size: 78,
        families: ["Lato", "Lato Extra Bold"],
        weight: "ExtraBold",
      },
      description: {
        size: 30,
        families: ["Lato", "Lato Extra Bold"],
        weight: "Normal",
      },
    },
    padding: 100,
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-400-normal.woff2",
      "https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-700-normal.woff2",
    ],
  }),
});
