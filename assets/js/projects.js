(() => {
  const grid = document.querySelector("[data-project-grid]");
  const filters = document.querySelector("[data-project-filters]");
  const count = document.querySelector("[data-project-count]");
  if (!grid || !filters) return;

  let projects = [];
  let selectedCategory = "All";

  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Project data could not be loaded.");
      return response.json();
    })
    .then((data) => {
      projects = data.filter((project) => project.status === "published");
      renderFilters();
      renderProjects();
    })
    .catch(() => {
      grid.innerHTML =
        '<p class="empty-state">We could not load the project gallery. Please try again later or <a href="index.html#contact">contact Hatch Excavation</a>.</p>';
    });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    filters.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderProjects();
  });

  function renderFilters() {
    const categories = ["All", ...new Set(projects.map((project) => project.category))];
    filters.innerHTML = categories
      .map(
        (category) =>
          `<button class="filter-button" type="button" data-category="${escapeAttribute(category)}" aria-pressed="${category === "All"}">${escapeHtml(category)}</button>`
      )
      .join("");
  }

  function renderProjects() {
    const visible =
      selectedCategory === "All"
        ? projects
        : projects.filter((project) => project.category === selectedCategory);

    if (count) {
      count.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;
    }

    if (!visible.length) {
      grid.innerHTML =
        '<p class="empty-state">No published projects are in this category yet.</p>';
      return;
    }

    grid.innerHTML = visible
      .map(
        (project) => `
          <article class="project-card">
            <a class="project-card__image" href="project.html?project=${encodeURIComponent(project.slug)}" aria-label="View ${escapeAttribute(project.title)}">
              <img src="${escapeAttribute(project.coverImage)}" alt="" width="600" height="400" loading="lazy">
            </a>
            <div class="project-card__body">
              <p class="eyebrow">${escapeHtml(project.category)}</p>
              <h2><a href="project.html?project=${encodeURIComponent(project.slug)}">${escapeHtml(project.title)}</a></h2>
              ${project.location ? `<span>${escapeHtml(project.location)}</span>` : ""}
              <p>${escapeHtml(project.summary)}</p>
              <a class="text-link" href="project.html?project=${encodeURIComponent(project.slug)}">View project photos <span aria-hidden="true">→</span></a>
            </div>
          </article>`
      )
      .join("");
  }

  function escapeHtml(value = "") {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
  }

  function escapeAttribute(value = "") {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }
})();
