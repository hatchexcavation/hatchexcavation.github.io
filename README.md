# Hatch Excavation website

A dependency-free static website for Hatch Excavation Inc. in Bridgton, Maine. It uses semantic HTML, one shared stylesheet, and small vanilla JavaScript files for the mobile menu and project gallery. It is ready to publish through GitHub Pages and also works at a custom domain.

## File structure

```text
.
├── index.html                   # Main site: services, history, area, contact
├── projects.html                # Filterable project listing
├── project.html                 # Reusable detail page; reads ?project=slug
├── aboutus.html                 # Legacy redirect
├── jobphotos.html               # Legacy redirect
├── contactus.html               # Legacy redirect
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── projects.js
│   │   └── project-page.js
│   └── images/
│       ├── brand/
│       ├── hero/
│       ├── originals/           # Untouched recovered source files
│       └── projects/
├── data/projects.json           # Edit projects here
└── source-archive/              # Recovered legacy HTML for reference
```

## Preview locally

Do not open the HTML files directly from Finder; browsers block JSON loading from `file://` URLs. Start a simple local server in this folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`. Stop the preview with `Control-C`.

## Add the first new real project

The website reads every project from `data/projects.json`, so a project only needs to be entered once.

1. Choose a short lowercase slug, for example `shorefront-restoration`.
2. Create `assets/images/projects/shorefront-restoration/`.
3. Put the card image in that folder as `cover.webp`.
4. Add gallery files such as `photo-01.webp`, `photo-02.webp`, and so on.
5. Open `data/projects.json` and copy the record whose slug is `sample-project`.
6. Replace every `SAMPLE` and `TODO` value. Set:
   - `slug` to the exact folder slug.
   - `category` to a concise reusable category.
   - `location` only when it is approved for publication; otherwise use an empty string.
   - `coverImage` and each image `src` to the new relative paths.
   - Each `alt` to what is visibly happening in that specific photo.
   - `featured` to `true` to make the project eligible for the homepage. The homepage displays the first three published featured records.
   - `status` to `published` only when every field and image is ready.
7. Add the new project URL to `sitemap.xml`.
8. Preview the listing, filters, detail page, previous/next links, and lightbox locally.

Keep the documentation-only sample record at the bottom, or copy it and leave the original unchanged for the next update.

## Photo preparation

- Keep camera originals outside the published project folder or add them under `assets/images/originals/`. Never overwrite the originals.
- Correct rotation before export.
- Export photographs as WebP at roughly 75–82% quality when practical.
- Aim for about 1600–2400 pixels on the longest edge for new gallery photos. Do not enlarge small images.
- Use a 3:2 or 4:3 landscape cover image when possible. Cards crop covers to 3:2; the lightbox shows full images.
- Give files descriptive lowercase names when convenient.
- Compress images before publishing. Squoosh, ImageOptim, or an equivalent local tool works well.
- Add the real pixel `width` and `height` to the JavaScript templates if future source images use a substantially different aspect ratio.

The recovered legacy photographs are only 498–600 pixels wide and already small (mostly under 100 KB). They remain JPEGs because re-encoding them would not materially improve the site and could reduce visible quality. Their untouched archived copies are in `assets/images/originals/`.

## Update contact information

Contact details appear in:

- `index.html` (contact panel, footer, structured data)
- `projects.html` and `project.html` (footer and call action)
- `README.md` (verification notes below)

Search the repository for the old phone, email, or address before publishing a change:

```sh
rg "207-647-2171|Mark@hatchexcavation.com|65 Wayside"
```

## Publish with GitHub Pages

1. Commit and push these files to the repository’s default branch.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the `/ (root)` folder, then save.
5. Wait for GitHub to show the generated `github.io` URL.
6. Test the home page, project gallery, one project detail URL, and all three legacy redirect URLs at that address.

All internal resources use relative paths, so the site works on both a GitHub project URL and the production custom domain.

## Connect `hatchexcavation.com` after the Pages site is verified

Do not change DNS until the temporary GitHub Pages address works.

1. In **Settings → Pages**, enter `hatchexcavation.com` under **Custom domain** and save. GitHub may create the repository `CNAME` file automatically.
2. At the DNS provider, add the apex-domain records currently documented by GitHub Pages. GitHub’s published IP addresses can change, so copy the current values from GitHub’s official “Managing a custom domain” documentation rather than from this README.
3. Add a `www` CNAME pointing to the repository owner’s `github.io` hostname if `www.hatchexcavation.com` should also work.
4. Wait for GitHub’s DNS check to pass, then enable **Enforce HTTPS**.
5. Test both the apex and `www` versions and confirm one redirects consistently to the chosen canonical hostname.

A `CNAME` file is intentionally not included because the production-domain decision and repository ownership have not yet been confirmed.

## SEO checklist

- [ ] Confirm `https://hatchexcavation.com` is the final canonical domain.
- [ ] If the domain changes, replace it in every canonical tag, Open Graph URL, `robots.txt`, `sitemap.xml`, and the JSON-LD block.
- [ ] Confirm the social preview photo and description.
- [ ] Update `sitemap.xml` whenever a published project is added.
- [ ] Verify the site in Google Search Console after the custom domain is live.
- [ ] Submit `https://hatchexcavation.com/sitemap.xml`.

## Owner verification and remaining TODOs

- **Street address:** the archived company website publishes **65 Wayside Avenue**. A recent Town of Bridgton contractor listing uses **80 Wayside Avenue**. Confirm the correct public/mailing address before launch, then update every occurrence.
- **Email:** the archived contact page publishes `Mark@hatchexcavation.com`, while the old footer uses `info@hatchexcavation.com`. The redesigned site uses Mark’s address because it was the explicit contact-page address. Confirm which mailbox should be primary.
- **Business name:** the historical copy supports “Hatch Excavation Inc.”; confirm exact punctuation for legal display.
- **Current personnel:** the original history says Robert continued with his son Mark after 2007. Confirm any present-day personnel details before adding them.
- **Project facts:** the recovered site did not publish project locations or reliable dates. These fields are intentionally blank.
- **Photos not recovered:** full-size archived copies of the older foundation, culvert, and septic-repair photo sets were unavailable. Thumbnail references and captions remain in `source-archive/html/` for future recovery or replacement.
- **Production domain:** confirm the repository should serve `hatchexcavation.com` before adding `CNAME`.

No analytics, tracking, cookies, external fonts, contact-form backend, credentials, or API keys are used.
