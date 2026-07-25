(() => {
  const menuButton = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-navigation]");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.removeAttribute("data-open");
    };

    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      navigation.toggleAttribute("data-open", willOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const featuredGrid = document.querySelector("[data-featured-projects]");
  if (!featuredGrid) return;

  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Project data could not be loaded.");
      return response.json();
    })
    .then((projects) => {
      const featured = projects
        .filter((project) => project.status === "published" && project.featured)
        .slice(0, 3);

      if (!featured.length) {
        featuredGrid.innerHTML =
          '<p class="empty-state">Project photos are being prepared. Please check back soon.</p>';
        return;
      }

      featuredGrid.innerHTML = featured.map(projectCard).join("");
    })
    .catch(() => {
      featuredGrid.innerHTML =
        '<p class="empty-state">Project photos are temporarily unavailable. You can still <a href="#contact">contact us about your work</a>.</p>';
    });

  function projectCard(project) {
    const location = project.location
      ? `<span>${escapeHtml(project.location)}</span>`
      : "";

    return `
      <article class="project-card">
        <a class="project-card__image" href="project.html?project=${encodeURIComponent(project.slug)}" aria-label="View ${escapeHtml(project.title)}">
          <img src="${escapeAttribute(project.coverImage)}" alt="" width="600" height="400" loading="lazy">
        </a>
        <div class="project-card__body">
          <p class="eyebrow">${escapeHtml(project.category)}</p>
          <h3><a href="project.html?project=${encodeURIComponent(project.slug)}">${escapeHtml(project.title)}</a></h3>
          ${location}
          <p>${escapeHtml(project.summary)}</p>
          <a class="text-link" href="project.html?project=${encodeURIComponent(project.slug)}">View project photos <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
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
