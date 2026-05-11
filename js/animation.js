(function () {
  "use strict";

  function initAOS() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  function animateCount(el, target, prefix, suffix, duration) {
    var start = performance.now();
    var from = 0;
    var pre = prefix || "";
    var suf = suffix || "";
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(from + (target - from) * eased);
      el.textContent = pre + val + suf;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.done) return;
          el.dataset.done = "1";
          var target = parseInt(el.getAttribute("data-count"), 10);
          var prefix = el.getAttribute("data-prefix") || "";
          var suffix = el.getAttribute("data-suffix") || "";
          animateCount(el, target, prefix, suffix, 1200);
        });
      },
      { threshold: 0.35 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initTyped() {
    if (typeof Typed === "undefined") return;
    var el = document.getElementById("typed-hero");
    if (!el) return;
    new Typed("#typed-hero", {
      strings: ["SEO 블로그 마케팅", "브랜드 콘텐츠 전략", "검색 노출 최적화"],
      typeSpeed: 45,
      backSpeed: 28,
      backDelay: 1400,
      loop: true,
      smartBackspace: true,
    });
  }

  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    var el = document.querySelector(".testimonial-swiper");
    if (!el) return;
    new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      spaceBetween: 18,
      loop: true,
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".testimonial-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 22 },
      },
    });
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initAOS();
    initCounters();
    initTyped();
    initSwiper();
  });
})();
