(function () {
  "use strict";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setYear() {
    qsa("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initHeaderScroll() {
    var header = qs("[data-header]");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav() {
    var header = qs("[data-header]");
    var toggle = qs("[data-nav-toggle]");
    var nav = qs("[data-nav]");
    if (!header || !toggle || !nav) return;

    function close() {
      header.classList.remove("is-nav-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function open() {
      header.classList.add("is-nav-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      if (header.classList.contains("is-nav-open")) close();
      else open();
    });

    nav.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.tagName === "A") close();
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 769px)").matches) close();
    });
  }

  function initAccordion() {
    var root = qs("[data-accordion]");
    if (!root) return;

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-accordion-trigger]");
      if (!btn) return;

      var item = btn.closest(".accordion-item");
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!item || !panel) return;

      var expanded = btn.getAttribute("aria-expanded") === "true";
      qsa(".accordion-item", root).forEach(function (other) {
        var ob = qs("[data-accordion-trigger]", other);
        var op = ob && ob.getAttribute("aria-controls");
        var opel = op ? document.getElementById(op) : null;
        if (other !== item && ob && opel) {
          other.classList.remove("is-open");
          ob.setAttribute("aria-expanded", "false");
          opel.setAttribute("hidden", "");
        }
      });

      if (expanded) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        panel.setAttribute("hidden", "");
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
      }
    });
  }

  function renderPortfolio(root, items) {
    root.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "portfolio-card";
      card.setAttribute("data-aos", "fade-up");
      card.style.setProperty("--card-accent", item.accent || "#4361ee");

      var cat = document.createElement("p");
      cat.className = "portfolio-mini-tag";
      cat.style.margin = "0";
      cat.textContent = item.category;

      var h = document.createElement("h2");
      h.textContent = item.title;

      var p = document.createElement("p");
      p.textContent = item.summary;

      var tags = document.createElement("div");
      tags.className = "portfolio-tags";
      (item.tags || []).forEach(function (tag) {
        var s = document.createElement("span");
        s.textContent = tag;
        tags.appendChild(s);
      });

      card.appendChild(cat);
      card.appendChild(h);
      card.appendChild(p);
      card.appendChild(tags);
      root.appendChild(card);
    });

    if (typeof AOS !== "undefined") {
      if (typeof AOS.refreshHard === "function") AOS.refreshHard();
      else AOS.refresh();
    }
  }

  function initPortfolio() {
    var root = qs("[data-portfolio-root]");
    if (!root) return;
    var loading = qs("[data-portfolio-loading]", root);

    var fallback = {
      items: [
        {
          title: "병원 블로그 SEO",
          category: "의료 · SEO",
          summary: "진료 키워드 중심 구조 개편",
          tags: ["블로그", "로컬 SEO"],
          accent: "#4361EE",
        },
        {
          title: "교육 콘텐츠 브랜딩",
          category: "교육 · 브랜딩",
          summary: "시리즈형 기획과 톤 통일",
          tags: ["브랜딩", "시리즈 기획"],
          accent: "#4CC9F0",
        },
        {
          title: "지역 기반 키워드 전략",
          category: "로컬 · 키워드",
          summary: "지역 검색 의도 분석",
          tags: ["키워드", "지역 마케팅"],
          accent: "#4361EE",
        },
        {
          title: "퍼스널 브랜드 블로그",
          category: "개인 · 콘텐츠",
          summary: "전문성 스토리텔링",
          tags: ["퍼스널 브랜드", "SEO"],
          accent: "#2B2D42",
        },
      ],
    };

    fetch("data/portfolio.json")
      .then(function (r) {
        if (!r.ok) throw new Error("fetch");
        return r.json();
      })
      .then(function (data) {
        if (loading) loading.remove();
        renderPortfolio(root, data.items || []);
      })
      .catch(function () {
        if (loading) loading.remove();
        renderPortfolio(root, fallback.items);
      });
  }

  var keywordMap = {
    default: ["검색 의도 분석", "롱테일 키워드", "지역 + 서비스 조합", "정보형 콘텐츠 허브", "내부 링크 설계"],
    피부: ["피부과 후기 키워드", "지역명 + 진료과목", "시술 Q&A 롱테일", "의료 정보형 글감", "비포에프터 가이드"],
    교육: ["커리큘럼 차별화", "수강 후기 키워드", "무료 체험 전환", "강사 전문성 키워드", "학습 로드맵"],
    카페: ["동네 카페 검색", "시그니처 메뉴 키워드", "브런치 지역 롱테일", "인스타 연계 검색어", "매장 분위기 키워드"],
  };

  function suggestKeywords(text) {
    var t = (text || "").toLowerCase();
    if (t.indexOf("피부") !== -1) return keywordMap.피부;
    if (t.indexOf("교육") !== -1 || t.indexOf("코딩") !== -1) return keywordMap.교육;
    if (t.indexOf("카페") !== -1) return keywordMap.카페;
    return keywordMap.default;
  }

  function initKeywordTool() {
    var form = qs("[data-keyword-form]");
    var out = qs("[data-keyword-results]");
    if (!form || !out) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[name=industry], #industry-input");
      var val = input ? input.value.trim() : "";
      var keys = suggestKeywords(val);
      out.innerHTML = "";
      keys.forEach(function (k) {
        var div = document.createElement("div");
        div.className = "keyword-chip";
        div.textContent = k;
        out.appendChild(div);
      });
    });
  }

  function initBlogDiagnostic() {
    var form = qs("[data-blog-diagnostic]");
    var panel = qs("[data-diagnostic-result]");
    if (!form || !panel) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[name=url], #blog-url");
      var url = input && input.value.trim();
      if (!url) return;

      var hash = 0;
      for (var i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
      var score = 68 + (hash % 28);

      panel.hidden = false;
      panel.innerHTML =
        "<h3>진단 결과 (데모)</h3>" +
        '<p class="diagnostic-score">' +
        score +
        "</p>" +
        "<p>URL 길이·구조 기반 시뮬레이션 점수입니다. 실제 SEO는 서버·콘텐츠·백링크 등 다각도 분석이 필요합니다.</p>" +
        "<ul class=\"list-dots\"><li>메타 타이틀·디스크립션 정비</li><li>주제 클러스터 내부링크</li><li>코어 웹 바이탈 점검</li></ul>";
    });
  }

  function faqReply(text) {
    var q = (text || "").toLowerCase();
    if (q.indexOf("운영") !== -1 || q.indexOf("블로그") !== -1) {
      return "블로그 기획·초안·편집·게시 가이드까지 단계별로 지원합니다.";
    }
    if (q.indexOf("기간") !== -1 || q.indexOf("걸리") !== -1 || q.indexOf("seo") !== -1) {
      return "보통 8~12주 내 초기 신호를 점검하고, 키워드 경쟁도에 따라 조정합니다.";
    }
    if (q.indexOf("ai") !== -1) {
      return "AI는 리서치·아웃라인 보조에 쓰고, 최종 톤과 품질은 전문가가 검수합니다.";
    }
    return "문의는 impress2121@naver.com 으로 보내주시면 맞춤으로 안내드릴게요.";
  }

  function initChat() {
    var fab = qs("[data-chat-toggle]");
    var panel = qs("[data-chat-panel]");
    var closeBtn = qs("[data-chat-close]");
    var form = qs("[data-chat-form]");
    var log = qs("[data-chat-log]");
    if (!fab || !panel || !form || !log) return;

    function push(role, msg) {
      var b = document.createElement("div");
      b.className = "chat-bubble " + (role === "user" ? "user" : "bot");
      b.textContent = msg;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
    }

    function setOpen(open) {
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", open ? "true" : "false");
    }

    push("bot", "안녕하세요! SEO·블로그 관련 질문을 입력해 보세요.");

    fab.addEventListener("click", function () {
      setOpen(panel.hidden);
    });
    closeBtn &&
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = qs("#chat-input", form);
      var v = input && input.value.trim();
      if (!v) return;
      push("user", v);
      input.value = "";
      push("bot", faqReply(v));
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
    setYear();
    initHeaderScroll();
    initNav();
    initAccordion();
    initPortfolio();
    initKeywordTool();
    initBlogDiagnostic();
    initChat();
  });
})();
