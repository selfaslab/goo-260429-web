# IM.Press (임프레스)

**슬로건:** 브랜드를 쓰다, 검색되게 만들다  
IM.Press는 **브랜딩 + SEO + 콘텐츠 마케팅**을 한 흐름으로 보여주는 정적 랜딩 페이지(HTML/CSS/Vanilla JS)입니다. GitHub Pages 무료 배포를 목표로 구성했습니다.

## 포함 기능(데모)

- Hero 타이핑/Blob 애니메이션 (AOS + Typed.js)
- 서비스/프로세스/포트폴리오 섹션 + 카드 UI
- 후기 슬라이드 (Swiper)
- FAQ 아코디언
- 문의/블로그 진단/FAQ 챗 패널(프론트 데모)

## 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- [AOS](https://michalsnik.github.io/aos/), [Typed.js](https://mattboldt.com/demos/typed-js/), [Swiper](https://swiperjs.com/)
- Pretendard (CDN)

## 로컬 실행

```bash
python -m http.server 8765
```

브라우저에서 `http://localhost:8765/` 접속 후 확인하세요. (`portfolio.html`은 `fetch`로 `data/portfolio.json`을 읽습니다.)

## GitHub Pages 배포

1. GitHub 저장소에 푸시
2. **Settings → Pages**에서 **Deploy from a branch**
3. 브랜치와 폴더를 `/ (root)`로 설정

## 배포 전 주의(SEO URL)

HTML의 `meta`/`canonical`, `robots.txt`/`sitemap.xml`의 URL에서 **`YOUR_USERNAME`** 과 경로(`/impress-agency/` 등)를 본인 GitHub Pages 주소에 맞게 바꿔주세요.

## 문의

- `impress2121@naver.com`
