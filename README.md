# 부동산 세금 컨설턴트 (2026)

한국 아파트의 **취득세 · 보유세(재산세+종부세) · 양도소득세**를 2026년 기준으로 계산하고, 최신 정책과 뉴스를 한 화면에서 확인하는 React 웹앱입니다.

> 추후 Replit으로 만든 **부동산 투자 컨설턴트** 앱과의 통합을 염두에 두고, 계산 로직과 UI를 분리하여 모듈화 설계했습니다.

## ✨ 기능

3개의 탭으로 구성됩니다.

1. **📋 정책 정리** – 2026년 한국 부동산 세제 핵심 변화, 세목별 요약, 조정대상지역 현황, 공식 출처 링크
2. **🧮 세금 계산기** – 입력값에 따른 실시간 계산
   - 취득세 (생애최초 감면 / 다주택 중과 / 농특세 / 지방교육세 자동 반영)
   - 보유세 = 재산세 + 종부세 (공정시장가액비율 / 1주택 특례 / 고령자·장기보유 세액공제)
   - 양도소득세 (1세대1주택 비과세 / 12억 초과분 안분 / 장기보유특별공제 표1·표2 / 단기/다주택 중과 / 2026.5.10 시행일 비교)
3. **📰 뉴스** – 정부/공식, 언론, 분석/리포트 카테고리별 큐레이션 + 키워드 검색

## 🚀 시작하기

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # 정적 사이트 빌드 (dist/)
npm test             # 계산 로직 검증 (17개 테스트)
```

## 🌐 GitHub Pages 배포

1. GitHub 저장소를 만들고 코드를 push
2. 저장소 **Settings → Pages → Source → "GitHub Actions"** 선택
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 실행되어 `https://<유저명>.github.io/<저장소명>/` 에 배포됨

> `vite.config.js`의 `base` 경로는 `VITE_REPO_NAME` 환경 변수로 자동 설정됩니다. 배포 워크플로가 GitHub 저장소 이름을 주입합니다.

## 📁 폴더 구조

```
realestate-tax-consultant/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── .github/workflows/deploy.yml   # GitHub Pages 자동 배포
└── src/
    ├── main.jsx                    # React 진입점
    ├── App.jsx                     # 메인 (탭 라우팅)
    │
    ├── data/                       # ⚙️ 세율표·정책·뉴스 데이터 (업데이트 포인트)
    │   ├── taxRates2026.js          - 2026년 모든 세율/공제 한 곳에 정리
    │   ├── policyData.js            - 정책 탭 카드 데이터
    │   └── newsLinks.js             - 뉴스 소스 큐레이션
    │
    ├── lib/                        # 🧮 순수 계산 라이브러리 (React 무관)
    │   ├── taxCalculations.js       - 4종 세금 + 통합 시뮬레이션
    │   └── taxCalculations.test.js  - node 직접 실행 가능한 테스트
    │
    ├── components/
    │   ├── common/                  - Tabs, Card, NumberInput, ResultDisplay
    │   ├── calculators/             - 3종 계산기 컴포넌트
    │   └── tabs/                    - PolicyTab, CalculatorTab, NewsTab
    │
    └── styles/index.css             - Tailwind + Pretendard
```

## 🔌 다른 앱과 통합

자세한 통합 가이드는 [INTEGRATION.md](./INTEGRATION.md) 참고.

요약하면:
- **계산 로직만 필요한 경우** → `src/lib/taxCalculations.js`를 통째로 복사하거나 npm package로 분리
- **UI 컴포넌트가 필요한 경우** → `src/components/calculators/*.jsx`를 import
- **전체 앱을 임베드** → `<App defaultTab="calculator" />`를 자식 라우트에서 렌더

## 📚 데이터 출처

- [국세청 (www.nts.go.kr)](https://www.nts.go.kr)
- [홈택스 (hometax.go.kr)](https://hometax.go.kr)
- [국토교통부 (www.molit.go.kr)](https://www.molit.go.kr)
- [행정안전부 - 지방세](https://www.mois.go.kr)
- 삼일 PwC, KB금융, 한국세정신문 등 공신력 있는 자료 기반

## ⚠️ 면책

본 도구는 일반 정보 제공 목적입니다. 실제 세무 신고는 국세청 홈택스 공식 도구 및 세무 전문가의 검토를 거치시기 바랍니다.

## 📄 라이선스

MIT
