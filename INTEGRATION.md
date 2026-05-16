# 통합 가이드 (부동산 투자 컨설턴트 앱과 합치기)

이 문서는 본 세금 컨설턴트를 다른 React 기반 앱(예: Replit으로 만든 부동산 투자 컨설턴트)과 통합하는 4가지 방법을 설명합니다.

## 🎯 통합 전략 선택

| 방법 | 결합도 | 권장 시점 |
|---|---|---|
| 1. **iframe 임베드** | 매우 낮음 | 가장 빠르게 합치고 싶을 때 |
| 2. **계산 로직만 이식** | 낮음 | UI는 통합 앱 스타일로 새로 만들고 싶을 때 |
| 3. **컴포넌트 단위 import** | 중간 | 일부 계산기만 가져다 쓰고 싶을 때 |
| 4. **전체 App 통합** | 높음 | 풀 기능을 하나의 앱에 합치고 싶을 때 |

---

## 방법 1. iframe 임베드 (가장 간단)

투자 컨설턴트 앱에서 본 앱을 iframe으로 띄우기.

```jsx
// 투자 컨설턴트 앱의 페이지
<iframe
  src="https://<유저명>.github.io/realestate-tax-consultant/#calculator"
  style={{ width: '100%', height: '900px', border: 'none' }}
  title="세금 계산기"
/>
```

URL 해시(`#calculator`, `#policy`, `#news`)로 특정 탭만 바로 띄울 수 있습니다.

---

## 방법 2. 계산 로직만 이식

UI를 통합 앱 스타일로 새로 짜고 싶을 때.

`src/lib/taxCalculations.js`와 `src/data/taxRates2026.js`만 통합 앱에 복사합니다. 이 두 파일은 React에 의존하지 않는 **순수 JS**입니다.

```js
// 투자 컨설턴트 앱 어딘가에서
import {
  calculateAcquisitionTax,
  calculatePropertyTax,
  calculateComprehensivePropertyTax,
  calculateCapitalGainsTax,
  simulateOwnership,
  formatKRW,
} from './lib/taxCalculations';

// 매수 시나리오 시뮬레이션
const acq = calculateAcquisitionTax({
  acquisitionPrice: 800_000_000,
  area: 84,
  homeCount: 1,
  isRegulated: true,
  isFirstTime: false,
});

console.log(formatKRW(acq.total));   // "5,500만원" 등
console.log(acq.breakdown);          // 세부 내역 배열
```

전 생애주기 시뮬레이션:

```js
const result = simulateOwnership({
  purchase: { acquisitionPrice: 800_000_000, area: 84, homeCount: 1 },
  holding:  { publishedPrice: 700_000_000, isOneHome: true },
  sale:     {
    salePrice: 1_500_000_000,
    acquisitionPrice: 800_000_000,
    expenses: 20_000_000,
    holdingYears: 7,
    residenceYears: 7,
    homeCount: 1,
    isOneHome: true,
    isRegulated: true,
    saleDate: '2027-06-01',
  },
  holdingYears: 7,
});

console.log(result.summary);
// {
//   acquisitionTax: 39_600_000,
//   annualHoldingTax: 1_200_000,
//   totalHoldingTax: 8_400_000,
//   capitalGainsTax: 0,                // 1주택 12억 이하면 비과세
//   lifetimeTotal: 48_000_000,
// }
```

투자 시뮬레이션 시 매년 보유세를 차감하거나, 매도 시점 양도세를 차감해 **순수익**을 산출하는 데 유용합니다.

---

## 방법 3. 컴포넌트 단위 import

특정 계산기 위젯만 통합 앱에 박아 넣고 싶을 때.

```jsx
// 투자 컨설턴트 앱에서
import AcquisitionTaxCalculator
  from 'realestate-tax-consultant/src/components/calculators/AcquisitionTaxCalculator';
import CapitalGainsTaxCalculator
  from 'realestate-tax-consultant/src/components/calculators/CapitalGainsTaxCalculator';

function InvestmentSimulator() {
  return (
    <div>
      <h2>매수 시 비용 계산</h2>
      <AcquisitionTaxCalculator />

      <h2>5년 후 매도 시나리오</h2>
      <CapitalGainsTaxCalculator />
    </div>
  );
}
```

각 계산기는 자체 state를 갖고 독립적으로 동작합니다. Tailwind 클래스를 사용하므로 통합 앱에도 Tailwind가 설정되어 있어야 합니다.

> **외부 제어형으로 변환하려면**: 각 계산기 컴포넌트 상단의 `useState`를 props로 들어 올리면 됩니다. (예: `value`, `onChange`를 받는 controlled component로 리팩토링)

---

## 방법 4. 전체 App 통합

투자 컨설턴트 앱 안에 본 세금 컨설턴트의 모든 탭을 그대로 띄우기.

```jsx
// 투자 컨설턴트 앱의 라우트 설정 예시
import TaxConsultantApp from 'realestate-tax-consultant/src/App';

function Routes() {
  return (
    <Routes>
      <Route path="/invest/*" element={<InvestmentApp />} />
      <Route path="/tax/*" element={<TaxConsultantApp defaultTab="calculator" />} />
    </Routes>
  );
}
```

`defaultTab` prop으로 초기 탭을 지정할 수 있습니다 (`policy` | `calculator` | `news`).

---

## 🔄 데이터 공유 패턴

투자 시뮬레이션 결과를 세금 계산기로 넘기고 싶을 때.

### Context 또는 상위 state 사용

```jsx
// 부모 컴포넌트
const [scenario, setScenario] = useState({
  purchasePrice: 800_000_000,
  expectedSalePrice: 1_500_000_000,
  expectedHoldYears: 7,
});

// 투자 컨설턴트 → 시나리오 업데이트
<InvestmentSimulator scenario={scenario} onChange={setScenario} />

// 세금 계산 → 시나리오 입력 받아 자동 계산
const taxes = simulateOwnership({
  purchase: { acquisitionPrice: scenario.purchasePrice, area: 84, homeCount: 1 },
  holding:  { publishedPrice: scenario.purchasePrice * 0.7 },
  sale: {
    salePrice: scenario.expectedSalePrice,
    acquisitionPrice: scenario.purchasePrice,
    holdingYears: scenario.expectedHoldYears,
    /* ... */
  },
  holdingYears: scenario.expectedHoldYears,
});
```

### URL 쿼리스트링으로 전달

iframe/별도 페이지로 띄울 때 유용:

```
/tax/calculator?price=800000000&area=84&homeCount=1
```

각 계산기 컴포넌트의 `useState` 초기값을 `URLSearchParams`에서 읽도록 한 줄 추가하면 됩니다.

---

## 🛠️ 세율 업데이트

법령 개정이 있을 때 **`src/data/taxRates2026.js`** 한 파일만 수정하면 모든 계산기가 자동 반영됩니다. 파일 상단 주석에 출처와 수정일을 함께 적어두면 추적이 쉽습니다.

새 연도(예: 2027) 데이터를 추가하려면:

1. `src/data/taxRates2026.js` 복사 → `taxRates2027.js`로 저장 후 값 갱신
2. `taxCalculations.js`의 import 경로 교체
3. `policyData.js`의 `META.baseYear` 등 갱신

---

## 🧪 검증

```bash
npm test     # node로 직접 실행, 17개 테스트 케이스
```

새 케이스 추가는 `src/lib/taxCalculations.test.js`에 `test('이름', () => {...})` 형태로 추가하면 됩니다.

---

## 📦 npm package로 분리하기 (선택)

본 프로젝트의 `package.json`에는 `exports` 필드가 이미 정의되어 있습니다.

```json
"exports": {
  "./tax": "./src/lib/taxCalculations.js",
  "./data": "./src/data/taxRates2026.js"
}
```

npm registry에 publish하면 통합 앱에서:

```js
import { calculateAcquisitionTax } from 'realestate-tax-consultant/tax';
import { ACQUISITION_TAX } from 'realestate-tax-consultant/data';
```

로 깔끔하게 import 가능합니다.
