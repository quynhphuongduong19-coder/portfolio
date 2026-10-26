(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll(".nav__item"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  function markActive() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = "#top";
    sections.forEach(function (sec) {
      if (sec.id !== "top" && sec.getBoundingClientRect().top + window.scrollY <= y) current = "#" + sec.id;
    });
    links.forEach(function (a) {
      var on = a.getAttribute("href") === current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  /* ---------- Customer stories carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var slides = track.querySelectorAll("[data-slide]");
    var dotsWrap = root.querySelector("[data-dots]");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var index = 0;

    var dots = Array.prototype.map.call(slides, function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Câu chuyện " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: "smooth" });
      dots.forEach(function (d, j) { d.setAttribute("aria-selected", String(j === index)); });
      prev.disabled = next.disabled = slides.length < 2;
    }

    prev.addEventListener("click", function () { go(index - 1); });
    next.addEventListener("click", function () { go(index + 1); });
    window.addEventListener("resize", function () { go(index); });
    go(0);
  });

  /* ---------- News scroller ---------- */
  document.querySelectorAll("[data-scroller]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    function step() {
      var card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Market ticker fade ---------- */
  var marketWrap = document.querySelector(".market__wrap");
  var marketList = document.querySelector(".market__list");
  function updateMarket() {
    var atEnd = marketList.scrollLeft + marketList.clientWidth >= marketList.scrollWidth - 2;
    marketWrap.classList.toggle("is-end", atEnd);
  }
  marketList.addEventListener("scroll", updateMarket, { passive: true });
  window.addEventListener("resize", updateMarket);
  updateMarket();

  /* ---------- Rating select placeholder colour ---------- */
  var rating = document.getElementById("f-rating");
  function updateRating() { rating.classList.toggle("is-placeholder", !rating.value); }
  rating.addEventListener("change", updateRating);
  updateRating();

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  var status = form.querySelector(".form__status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalid = null;
    form.querySelectorAll("[required]").forEach(function (el) {
      var bad = !el.value.trim() || (el.type === "email" && !el.checkValidity());
      el.closest(".input").classList.toggle("is-invalid", bad);
      if (bad && !invalid) invalid = el;
    });
    if (invalid) {
      status.textContent = "Vui lòng điền đầy đủ họ tên, email hợp lệ và nội dung góp ý.";
      status.className = "form__status is-error";
      invalid.focus();
      return;
    }
    status.textContent = "Cảm ơn bạn! Ý kiến của bạn đã được ghi nhận.";
    status.className = "form__status is-ok";
    form.reset();
    updateRating();
  });
  form.addEventListener("input", function (e) {
    var box = e.target.closest(".input");
    if (box) box.classList.remove("is-invalid");
  });
})();
