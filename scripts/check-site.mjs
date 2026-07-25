import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const errors = [];

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const references = [...source.matchAll(/\b(?:href|src)=["']([^"'#]+(?:#[^"']*)?)["']/g)].map(
    (match) => match[1]
  );

  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue;
    const [withQuery, fragment = ""] = reference.split("#");
    const pathname = withQuery.split("?")[0];
    const target = pathname ? path.resolve(root, pathname) : path.resolve(root, file);

    if (!fs.existsSync(target)) {
      errors.push(`${file}: missing ${reference}`);
      continue;
    }

    if (fragment && target.endsWith(".html")) {
      const targetSource = fs.readFileSync(target, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\bid=["']${escaped}["']`).test(targetSource)) {
        errors.push(`${file}: missing anchor #${fragment} in ${path.basename(target)}`);
      }
    }
  }
}

const projects = JSON.parse(fs.readFileSync(path.join(root, "data/projects.json"), "utf8"));
for (const project of projects) {
  for (const image of [project.coverImage, ...project.images.map((item) => item.src)]) {
    if (!fs.existsSync(path.resolve(root, image))) {
      errors.push(`data/projects.json (${project.slug}): missing ${image}`);
    }
  }
}

const css = fs.readFileSync(path.join(root, "assets/css/styles.css"), "utf8");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  if (/^(?:https?:|data:)/.test(match[1])) continue;
  const target = path.resolve(root, "assets/css", match[1]);
  if (!fs.existsSync(target)) errors.push(`styles.css: missing ${match[1]}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Site check passed: ${htmlFiles.length} HTML pages, ${projects.length} project records, and all referenced local files found.`
);
