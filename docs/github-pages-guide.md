# GitHub Pages를 활용한 정적 웹 사이트 호스팅 가이드

> 1인 게임 개발자를 위한 개인 소개 페이지 제작 가이드

---

## 1. 개요

이 문서는 정적 웹 사이트를 GitHub Pages로 호스팅하여 개인 소개 페이지를 운영하는 방법을 안내합니다.

### 왜 정적 사이트인가?

| 특성 | 정적 사이트 | 동적 사이트 |
|------|-----------|-----------|
| 서버 비용 | 무료 (GitHub Pages) | 월 비용 발생 |
| 보안 | 공격 표면 최소 | DB/서버 취약점 관리 필요 |
| 속도 | CDN 배포로 빠름 | 서버 응답 시간에 의존 |
| 유지보수 | HTML/CSS만 관리 | 서버, DB, 런타임 업데이트 필요 |
| 적합 대상 | 포트폴리오, 소개 페이지 | 사용자 인증, 실시간 기능 |

### 왜 GitHub Pages인가?

- **무료 호스팅**: 퍼블릭 레포지토리 기준 완전 무료
- **커스텀 도메인**: 개인 도메인 연결 지원 + HTTPS 자동 적용
- **Git 기반 배포**: `git push`만으로 자동 배포
- **GitHub Actions 연동**: 빌드 자동화 파이프라인 구성 가능

---

## 2. GitHub Pages 호스팅 방식

GitHub Pages는 두 가지 유형의 사이트를 지원합니다.

### 2.1 사용자/조직 사이트 (User/Organization Site)

- **레포지토리 이름**: `<username>.github.io`
- **URL**: `https://<username>.github.io`
- **배포 브랜치**: `main` (기본값)
- **용도**: 개인 포트폴리오, 메인 사이트

```
예시: 사용자명이 "gamedev-grain"인 경우
레포지토리: gamedev-grain.github.io
URL: https://gamedev-grain.github.io
```

### 2.2 프로젝트 사이트 (Project Site)

- **레포지토리 이름**: 아무 이름 가능
- **URL**: `https://<username>.github.io/<repository-name>`
- **배포 브랜치**: `main`, `gh-pages`, 또는 특정 폴더
- **용도**: 개별 프로젝트 문서, 게임별 소개 페이지

```
예시: 레포지토리명이 "my-awesome-game"인 경우
URL: https://gamedev-grain.github.io/my-awesome-game
```

### 추천

> 개인 소개 페이지로는 **사용자 사이트** (`<username>.github.io`)를 추천합니다.
> 깔끔한 루트 URL을 사용할 수 있고, 나중에 커스텀 도메인을 연결하기도 편리합니다.

---

## 3. 프로젝트 구조

### 3.1 기본 구조 (순수 HTML/CSS/JS)

```
📂 <username>.github.io/
├── index.html          # 메인 페이지
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── main.js         # 자바스크립트 (선택)
├── images/
│   ├── profile.jpg     # 프로필 사진
│   ├── game-1.png      # 게임 스크린샷
│   └── game-2.png
├── favicon.ico         # 파비콘
├── CNAME               # 커스텀 도메인 설정 (선택)
└── README.md           # 프로젝트 설명
```

### 3.2 게임 개발자 소개 페이지 권장 섹션

1. **히어로 섹션**: 이름, 한 줄 소개, 프로필 이미지
2. **About**: 자기소개 및 게임 개발 철학
3. **Projects/Games**: 개발한 게임 목록 (스크린샷 + 설명 + 링크)
4. **Skills**: 사용 기술 스택 (엔진, 언어, 도구)
5. **Contact**: 연락처, SNS 링크
6. **Footer**: 저작권, GitHub 링크

---

## 4. 설정 및 배포 절차

### 4.1 레포지토리 생성

```bash
# 로컬에서 프로젝트 초기화
git init
git branch -M main

# GitHub에 레포지토리 생성 후 원격 연결
git remote add origin https://github.com/<username>/<username>.github.io.git
```

### 4.2 GitHub Pages 활성화

1. GitHub 레포지토리 → **Settings** → **Pages**
2. **Source** 섹션에서:
   - **Deploy from a branch** 선택
   - 브랜치: `main`, 폴더: `/ (root)` 선택
3. **Save** 클릭

### 4.3 배포

```bash
# 파일 추가 및 커밋
git add .
git commit -m "Initial site deployment"
git push -u origin main
```

배포 후 약 1~2분 내에 `https://<username>.github.io`에서 사이트 확인 가능.

### 4.4 커스텀 도메인 설정 (선택)

1. 도메인 등록 업체에서 DNS 레코드 설정:

   ```
   # A 레코드 (apex 도메인)
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153

   # CNAME 레코드 (www 서브도메인)
   www → <username>.github.io
   ```

2. 레포지토리 루트에 `CNAME` 파일 생성:

   ```
   www.yourdomain.com
   ```

3. GitHub Settings → Pages → Custom domain에 도메인 입력
4. **Enforce HTTPS** 체크

---

## 5. GitHub Actions를 활용한 자동 배포 (선택)

순수 HTML/CSS라면 GitHub Actions가 필수는 아니지만, 빌드 단계가 필요한 경우 유용합니다.

### 기본 워크플로우 예시

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 6. 제약 사항 및 유의점

| 항목 | 제한 |
|------|------|
| 레포지토리 크기 | 1 GB 권장 (소프트 리밋) |
| 사이트 크기 | 1 GB 이하 권장 |
| 대역폭 | 월 100 GB (소프트 리밋) |
| 빌드 횟수 | 시간당 10회 제한 |
| 서버사이드 코드 | 지원하지 않음 (PHP, Python 등 불가) |
| 프라이빗 레포 | GitHub Pro 이상 필요 |

### 주의사항

- GitHub Pages는 **상업적 목적의 온라인 스토어** 등에는 부적합
- 민감한 정보(API 키, 비밀번호)를 절대 레포지토리에 포함하지 않기
- 대용량 이미지는 최적화(WebP 변환, 압축)하여 사용

---

## 7. 다음 단계

이 가이드를 바탕으로 다음 순서로 진행합니다:

1. [x] 호스팅 방식 이해 및 가이드 문서 작성
2. [ ] HTML/CSS 기본 구조 작성 (`index.html`, `style.css`)
3. [ ] 게임 개발자 소개 콘텐츠 구성
4. [ ] 반응형 디자인 적용
5. [ ] GitHub Pages 배포 설정
6. [ ] (선택) 커스텀 도메인 연결

---

## 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [GitHub Pages 빠른 시작](https://docs.github.com/en/pages/quickstart)
- [커스텀 도메인 설정](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
