$(function () {

  /* ---------- PROJECT DATA ---------- */
  const PROJECTS = [
    {
      title: "3-2-1 Challenge",
      desc: "A daily/weekly/monthly goal tracker with a history table, built as my capstone. Deployed live with Render + Neon Postgres.",
      tags: ["Express", "EJS", "jQuery", "PostgreSQL", "Render", "Neon"],
      status: "live",
      link: "https://three-2-1-challenge.onrender.com/"
    },
    {
      title: "Simon Game",
      desc: "The classic memory game, built from scratch with vanilla JS and jQuery — event listeners, sound, and sequence logic, self-guided with hints only.",
      tags: ["JavaScript", "jQuery", "CSS"],
      status: "live",
      link: "https://vishal1948.github.io/Simon-Game/"
    }
    // {
    //   title: "Task API",
    //   desc: "A REST API for managing tasks — routing, middleware, and JWT-based auth, built to actually understand the Express request pipeline, not just copy it.",
    //   tags: ["Node.js", "Express", "JWT", "REST"],
    //   status: "live",
    //   link: "https://three-2-1-challenge.onrender.com/"
    // }
    // {
    //   title: "Country Capital Quiz",
    //   desc: "A quiz app backed by PostgreSQL, working around a real pre-existing schema quirk instead of a clean textbook database.",
    //   tags: ["Node.js", "PostgreSQL", "pgAdmin"],
    //   status: "course",
    //   link: "#"
    // }
  ];



  const $grid = $("#projectGrid");
  PROJECTS.forEach((p, i) => {
    const idx = String(i + 1).padStart(2, "0");
    const statusClass = p.status === "live" ? "project__status--live" : "project__status--course";
    const statusLabel = p.status === "live" ? "● deployed" : "○ course build";
    const $card = $(`
      <article class="project reveal">
        <div class="project__top">
          <span class="project__index">${idx}</span>
          <span class="project__status ${statusClass}">${statusLabel}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul>
        <a class="project__link" href="${p.link}" target="_blank" rel="noopener">view project →</a>
      </article>
    `);
    $grid.append($card);
  });

  /* ---------- MOBILE NAV ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navAnchors = navLinks.querySelectorAll("a");

  function closeMenu() {
    nav.classList.remove("nav--open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    nav.classList.add("nav--open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("nav--open");
    isOpen ? closeMenu() : openMenu();
  });

  navAnchors.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  /* ---------- ACTIVE NAV ON SCROLL ---------- */
  const $sections = $("section[id]");
  const $navLinks = $("[data-nav]");

  function onScrollSpy() {
    const scrollPos = $(window).scrollTop() + 120;
    let currentId = null;
    $sections.each(function () {
      if ($(this).offset().top <= scrollPos) {
        currentId = $(this).attr("id");
      }
    });
    $navLinks.removeClass("active");
    if (currentId) {
      $navLinks.filter(`[href="#${currentId}"]`).addClass("active");
    }
  }
  $(window).on("scroll", onScrollSpy);
  onScrollSpy();

  /* ---------- SCROLL REVEAL ---------- */
  function addRevealClass() {
    $(".section__head, .commit, .freelance__card, .stackgroup, .contact__form")
      .addClass("reveal");
  }
  addRevealClass();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(entry.target).addClass("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // observe after project cards are appended too
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  }, 0);

  /* ---------- TERMINAL TYPING EFFECT ---------- */
  const $typedLine = $("#typedLine");
  const fullText = $typedLine.text().trim();
  $typedLine.text("");
  let charIndex = 0;
  function typeHero() {
    if (charIndex <= fullText.length) {
      $typedLine.text(fullText.slice(0, charIndex));
      charIndex++;
      setTimeout(typeHero, 45);
    }
  }
  typeHero();

  /* ---------- SMOOTH SCROLL ---------- */
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 70 }, 500);
    }
  });

  /* ---------- BACK TO TOP ---------- */
  $("#toTop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  /* ---------- CONTACT FORM (Formspree AJAX submit) ---------- */
$("#contactForm").on("submit", function (e) {
  e.preventDefault();

  const $form = $(this);
  const $status = $("#contactStatus");
  const name = $("#name").val().trim();

  if (!name) return;

  $status.text("Sending…");

  $.ajax({
    url: $form.attr("action"),   // your Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
    method: "POST",
    data: $form.serialize(),
    dataType: "json",
    headers: { "Accept": "application/json" }
  })
  .done(function () {
    $status.text(`Thanks, ${name} — your message has been sent.`);
    $form[0].reset();
  })
  .fail(function (jqXHR) {
    const errMsg = jqXHR.responseJSON && jqXHR.responseJSON.errors
      ? jqXHR.responseJSON.errors.map(e => e.message).join(", ")
      : "Something went wrong — please try again.";
    $status.text(errMsg);
  });
});

  /* ---------- SUBTLE TILT ON FREELANCE MEDIA ---------- */
  $("[data-tilt]").on("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    $(this).css("transform", `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`);
  }).on("mouseleave", function () {
    $(this).css("transform", "perspective(600px) rotateY(0) rotateX(0)");
  });
  
  // ---- Update copyright year automatically ----
  $('#year').text(new Date().getFullYear());

});




