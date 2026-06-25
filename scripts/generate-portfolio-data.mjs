import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKS_DIR = path.resolve(__dirname, "..", "public", "images", "our-works");
const OUTPUT = path.resolve(__dirname, "..", "src", "lib", "portfolio-data.ts");

const projectMetadata = {
  Architecture: { title: "Sri Sakthi Premium Villa", location: "Coimbatore, Tamil Nadu", description: "A premium contemporary residence designed with modern architecture, functional planning, and elegant exterior finishes." },
  Construction: { title: "Anandam Residency", location: "Madurai, Tamil Nadu", description: "Residential construction project featuring premium materials, spacious planning, and quality craftsmanship." },
  "Real-Estate": { title: "Raja Thanga Maligai", location: "Tirunelveli, Tamil Nadu", description: "A landmark commercial property development featuring prime retail spaces and premium office suites." },
  "Web-Development": { title: "City Corner Bakery", location: "Chennai, Tamil Nadu", description: "A complete digital presence transformation for a boutique bakery with modern web design and brand storytelling." },
  "App-Development": { title: "Green Valley Interiors", location: "Salem, Tamil Nadu", description: "Luxury interior design project featuring curated living spaces, modern aesthetics, and seamless functionality." },
  "Digital-Marketing": { title: "Vellore Premium Bedrooms", location: "Vellore, Tamil Nadu", description: "A digital marketing campaign showcasing premium bedroom designs through strategic visual storytelling." },
};

function slugify(text) {
  return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const entries = fs.readdirSync(WORKS_DIR, { withFileTypes: true });
const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
const projects = [];

for (const folderName of folders) {
  const folderPath = path.join(WORKS_DIR, folderName);
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".webp"))
    .sort((a, b) => parseInt(a) - parseInt(b));
  if (files.length === 0) continue;
  const meta = projectMetadata[folderName];
  if (!meta) { console.warn("No metadata for:", folderName); continue; }
  projects.push({
    id: slugify(meta.title), title: meta.title, slug: slugify(meta.title),
    location: meta.location, description: meta.description, category: folderName,
    coverImage: `/images/our-works/${folderName}/${files[0]}`,
    galleryImages: files.map((f) => `/images/our-works/${folderName}/${f}`),
  });
}

const code = `// Auto-generated — DO NOT EDIT. Run \`npm run generate:portfolio\` to regenerate.\n\nexport interface PortfolioProject {\n  id: string;\n  title: string;\n  slug: string;\n  location: string;\n  description: string;\n  category: string;\n  coverImage: string;\n  galleryImages: string[];\n}\n\nconst projects: PortfolioProject[] = ${JSON.stringify(projects, null, 2)};\n\nexport function getAllProjects(): PortfolioProject[] {\n  return projects;\n}\n\nexport function getProjectBySlug(slug: string): PortfolioProject | null {\n  return projects.find((p) => p.slug === slug) ?? null;\n}\n\nexport function getRelatedProjects(slug: string, count = 3): PortfolioProject[] {\n  return projects.filter((p) => p.slug !== slug).slice(0, count);\n}\n`;

fs.writeFileSync(OUTPUT, code, "utf-8");
console.log(`Generated: ${projects.length} projects -> ${OUTPUT}`);
