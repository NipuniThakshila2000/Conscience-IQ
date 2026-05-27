const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

document.documentElement.classList.add("animations-ready");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
}

document.querySelectorAll(".read-more-toggle").forEach((button) => {
  const targetId = button.getAttribute("aria-controls");
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return;
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    const groupedTargets = document.querySelectorAll(`[data-collapse-group="${targetId}"]`);

    button.setAttribute("aria-expanded", String(nextExpanded));
    button.textContent = nextExpanded ? "Show Less" : "Read More";
    target.hidden = !nextExpanded;
    groupedTargets.forEach((item) => {
      item.hidden = !nextExpanded;
    });
    button.closest("article")?.classList.toggle("is-expanded", nextExpanded);
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealSelectors = [
    ".intro > *",
    ".statement p",
    ".roots-art img",
    ".roots-copy",
    ".cards article",
    ".transform h2",
    ".compass",
    ".flow-left",
    ".flow-copy",
    ".section-label",
    ".expert-list article",
    ".mission",
    ".research > h2",
    ".research-subtitle",
    ".page-main > *",
    ".site-footer > img",
    ".footer-panel > *:not(.footer-copyright)",
    ".footer-content > *"
  ];

  const revealItems = document.querySelectorAll(revealSelectors.join(","));

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  document.querySelectorAll(".scale, .flow-left").forEach((item) => {
    item.classList.add("from-left");
  });

  document.querySelectorAll(".intro-copy, .flow-copy, .site-footer > img").forEach((item) => {
    item.classList.add("from-right");
  });

  document.querySelectorAll(".cards article, .expert-list article").forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 110}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.16
    });

    revealItems.forEach((item) => observer.observe(item));
  }

  const transformSection = document.querySelector(".transform");
  if (transformSection) {
    if (!("IntersectionObserver" in window)) {
      transformSection.classList.add("art-visible");
    } else {
      const transformObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("art-visible");
          } else {
            entry.target.classList.remove("art-visible");
          }
        });
      }, {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.24
      });

      transformObserver.observe(transformSection);
    }
  }

  const driftItems = document.querySelectorAll(".scale, .statement img:not(.plane)");
  driftItems.forEach((item, index) => {
    item.classList.add(index % 2 ? "drift-slow" : "drift-soft");
  });

  const scrollPlanes = document.querySelectorAll(".plane");
  if (scrollPlanes.length) {
    let ticking = false;

    const updatePlaneScroll = () => {
      scrollPlanes.forEach((plane) => {
        const parent = plane.parentElement;
        const parentRect = parent ? parent.getBoundingClientRect() : document.body.getBoundingClientRect();
        const travelStart = window.innerHeight * 1.18;
        const travelEnd = -parentRect.height * 0.75;
        const rawProgress = (travelStart - parentRect.top) / Math.max(travelStart - travelEnd, 1);
        const progress = Math.min(Math.max(rawProgress, 0), 1);
        const eased = progress * progress * (3 - 2 * progress);
        const parentWidth = parent ? parent.clientWidth : window.innerWidth;
        const startX = -plane.offsetWidth - 90;
        const endX = parentWidth + 90;
        const x = startX + (endX - startX) * eased;
        const y = -52 * Math.sin(eased * Math.PI);
        const rotate = -7 + eased * 12;
        const scale = .94 + eased * .08;

        plane.classList.add("scroll-plane", "is-visible");
        plane.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
      });

      ticking = false;
    };

    const requestPlaneUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePlaneScroll);
        ticking = true;
      }
    };

    updatePlaneScroll();
    window.addEventListener("scroll", requestPlaneUpdate, { passive: true });
    window.addEventListener("resize", requestPlaneUpdate);
  }
} else {
  document.documentElement.classList.add("reduced-motion");
}
