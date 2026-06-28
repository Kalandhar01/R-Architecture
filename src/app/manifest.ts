import type { MetadataRoute } from "next";
import { LOGO_IMAGE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ractysh Design Private Limited",
    short_name: "Ractysh Design",
    description:
      "Ractysh Design Private Limited is a premium architecture and interior design firm delivering residential, commercial, institutional, and luxury architectural solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: LOGO_IMAGE,
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
