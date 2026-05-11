(function () {
  function trimSlash(u) {
    return u.replace(/\/+$/, "");
  }

  function getBaseUrl() {
    var meta = document.querySelector('meta[name="impress:site-url"]');
    var fromMeta = meta && meta.getAttribute("content");
    if (fromMeta && fromMeta.indexOf("YOUR_USERNAME") === -1) {
      return trimSlash(fromMeta);
    }
    try {
      var loc = window.location;
      if (loc.protocol === "file:") {
        return "https://YOUR_USERNAME.github.io/impress-agency";
      }
      var path = loc.pathname.endsWith(".html")
        ? loc.pathname.replace(/[^/]+$/, "")
        : loc.pathname.endsWith("/")
          ? loc.pathname
          : loc.pathname + "/";
      return trimSlash(loc.origin + path);
    } catch (e) {
      return "https://YOUR_USERNAME.github.io/impress-agency";
    }
  }

  function injectOrganization() {
    var base = getBaseUrl();
    var data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": base + "/#organization",
      name: "IM.Press",
      alternateName: "임프레스",
      url: base + "/",
      email: "impress2121@naver.com",
      description:
        "검색되는 브랜드를 만드는 SEO 기반 블로그 홍보 및 콘텐츠 마케팅 에이전시",
      slogan: "브랜드를 쓰다, 검색되게 만들다",
      serviceType: [
        "SEO 블로그 운영",
        "콘텐츠 브랜딩",
        "키워드 분석",
        "블로그 최적화",
      ],
    };

    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectOrganization);
  } else {
    injectOrganization();
  }
})();
