document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const quoteModal       = document.getElementById("quoteModal");
  const openQuoteButtons = document.querySelectorAll("#openQuoteBtnTop, #openQuoteBtn");
  const closeQuoteBtn    = document.getElementById("closeQuoteBtn");
  const projectLightbox  = document.getElementById("project-lightbox");
  const lightboxClose    = projectLightbox?.querySelector(".lightbox-close");
  const lbImg            = projectLightbox?.querySelector(".lightbox-img");
  const projectImages    = document.querySelectorAll(".project-item img");

  // Forms
  const quoteForms = document.querySelectorAll("#homepageQuoteForm, #modalQuoteForm");

  // Helpers to open/close modals
  function openModal(modalEl) {
    modalEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const firstField = modalEl.querySelector("input, textarea, button");
    firstField?.focus();
  }
  function closeModal(modalEl) {
    modalEl.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  // 1) Modal open/close
  openQuoteButtons.forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      openModal(quoteModal);
    })
  );

  if (closeQuoteBtn) {
    closeQuoteBtn.addEventListener("click", () => closeModal(quoteModal));
  }
  quoteModal?.addEventListener("click", e => {
    if (e.target === quoteModal) closeModal(quoteModal);
  });

  // 2) Lightbox open/close
  projectImages.forEach(img => {
    img.addEventListener("click", () => {
      const fullSrc = img.dataset.full;
      if (!projectLightbox || !lbImg || !fullSrc) return;
      lbImg.src = fullSrc;
      lbImg.alt = img.alt;
      openModal(projectLightbox);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => closeModal(projectLightbox));
  }
  projectLightbox?.addEventListener("click", e => {
    if (e.target === projectLightbox) closeModal(projectLightbox);
  });

  // 3) Shared quote-form submit handler
  async function handleQuoteSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch("/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      alert(json.message || json.error);

      if (json.success) {
        // close modal if this was the modal form
        if (e.target.id === "modalQuoteForm") {
          closeModal(quoteModal);
        }
        e.target.reset();
      }
    } catch (err) {
      console.error(err);
      alert("Oops—something went wrong. Please try again later.");
    }
  }

  quoteForms.forEach(form => form.addEventListener("submit", handleQuoteSubmit));

  // 4) Global Escape key to close open modals/lightbox
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (quoteModal?.classList.contains("is-open")) {
        closeModal(quoteModal);
      }
      if (projectLightbox?.classList.contains("is-open")) {
        closeModal(projectLightbox);
      }
    }
  });
});