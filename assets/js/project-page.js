(() => {
  const projectRoot = document.querySelector("[data-project-detail]");
  if (!projectRoot) return;

  const slug = new URLSearchParams(window.location.search).get("project");
  const dialog = document.querySelector("[data-lightbox]");
  const lightboxImage = dialog?.querySelector("[data-lightbox-image]");
  const lightboxCaption = dialog?.querySelector("[data-lightbox-caption]");
  const closeButton = dialog?.querySelector("[data-lightbox-close]");
  const previousButton = dialog?.querySelector("[data-lightbox-previous]");
  const nextButton = dialog?.querySelector("[data-lightbox-next]");
  let activeImages = [];
  let activeIndex = 0;
  let lastTrigger = null;

  if (!slug) {
    showNotFound();
    return;
  }

  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Project data could not be loaded.");
      return response.json();
    })
    .then((projects) => {
      const published = projects.filter((project) => project.status === "published");
      const project = published.find((item) => item.slug === slug);
      if (!project) {
        showNotFound();
        return;
      }
      renderProject(project, published);
    })
    .catch(showNotFound);

  function renderProject(project, published) {
    document.title = `${project.title} | Hatch Excavation`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", project.summary);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = `https://hatchexcavation.com/project.html?project=${encodeURIComponent(project.slug)}`;
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.content = `${project.title} | Hatch Excavation`;
    if (ogDescription) ogDescription.content = project.summary;
    if (ogUrl) ogUrl.content = canonical?.href || window.location.href;
    activeImages = project.images;

    const projectIndex = published.findIndex((item) => item.slug === project.slug);
    const previousProject = published[(projectIndex - 1 + published.length) % published.length];
    const nextProject = published[(projectIndex + 1) % published.length];

    projectRoot.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="projects.html">Projects</a><span aria-hidden="true">/</span><span>${escapeHtml(project.title)}</span>
      </nav>
      <header class="project-header">
        <p class="eyebrow">${escapeHtml(project.category)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        ${project.location ? `<p class="project-location">${escapeHtml(project.location)}</p>` : ""}
        <p class="project-summary">${escapeHtml(project.summary)}</p>
      </header>
      <div class="photo-grid">
        ${project.images
          .map(
            (image, index) => `
              <button class="photo-button" type="button" data-photo-index="${index}" aria-label="Open photo ${index + 1} of ${project.images.length}: ${escapeAttribute(image.alt)}">
                <img src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.alt)}" width="600" height="400" ${index ? 'loading="lazy"' : ""}>
              </button>`
          )
          .join("")}
      </div>
      <nav class="project-pagination" aria-label="Other projects">
        <a href="project.html?project=${encodeURIComponent(previousProject.slug)}"><span aria-hidden="true">←</span><span><small>Previous project</small>${escapeHtml(previousProject.title)}</span></a>
        <a href="project.html?project=${encodeURIComponent(nextProject.slug)}"><span><small>Next project</small>${escapeHtml(nextProject.title)}</span><span aria-hidden="true">→</span></a>
      </nav>`;

    projectRoot.addEventListener("click", (event) => {
      const button = event.target.closest("[data-photo-index]");
      if (!button) return;
      lastTrigger = button;
      openLightbox(Number(button.dataset.photoIndex));
    });
  }

  function showNotFound() {
    projectRoot.innerHTML = `
      <div class="empty-state empty-state--large">
        <p class="eyebrow">Project not found</p>
        <h1>This project is not available.</h1>
        <p>The link may be old, or the project may still be awaiting publication.</p>
        <a class="button button--primary" href="projects.html">View all projects</a>
      </div>`;
  }

  function openLightbox(index) {
    if (!dialog || !lightboxImage || !lightboxCaption) return;
    activeIndex = index;
    updateLightbox();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    closeButton?.focus();
  }

  function updateLightbox() {
    const image = activeImages[activeIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = `${activeIndex + 1} of ${activeImages.length} — ${image.alt}`;
    previousButton.disabled = activeImages.length < 2;
    nextButton.disabled = activeImages.length < 2;
  }

  function move(direction) {
    activeIndex = (activeIndex + direction + activeImages.length) % activeImages.length;
    updateLightbox();
  }

  function closeLightbox() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    lastTrigger?.focus();
  }

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", () => move(-1));
  nextButton?.addEventListener("click", () => move(1));
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!dialog?.open) return;
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  function escapeHtml(value = "") {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
  }

  function escapeAttribute(value = "") {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }
})();
