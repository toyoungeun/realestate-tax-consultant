// 간단 검증 스크립트. node로 직접 실행 가능.
// 사용: node src/lib/taxCalculations.test.js

import {
  calculateAcquisitionTax,
  calculatePropertyTax,
  calculateComprehensivePropertyTax,
  calculateCapitalGainsTax,
  simulateOwnership,
  formatKRW,
} from './taxCalculations.js';

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}
function assertClose(actual, expected, tolerance, label) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `❌ ${label}: 기대값 ${expected.toLocaleString()} (±${tolerance}), 실제 ${actual.toLocaleString()} (차이 ${diff.toLocaleString()})`
    );
  }
}

// ============ 취득세 ============
test('취득세: 1주택 5억 (1%), 전용 84㎡ (농특세 면제)', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 500_000_000,
    area: 84,
    homeCount: 1,
    isRegulated: false,
    isFirstTime: false,
  });
  // 본세 500만, 농특세 0(85㎡ 이하 면제), 지방교육세 50만 = 550만
  assertClose(r.total, 5_500_000, 100, '취득세 5억');
});

test('취득세: 1주택 5억 (1%), 전용 100㎡ (농특세 포함)', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 500_000_000,
    area: 100,
    homeCount: 1,
  });
  // 본세 500만, 농특세 50만, 지방교육세 50만 = 600만
  assertClose(r.total, 6_000_000, 100, '취득세 5억 100㎡');
});

test('취득세: 1주택 9억 초과 12억 (3%), 84㎡', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 1_200_000_000,
    area: 84,
    homeCount: 1,
  });
  // 본세 3,600만, 농특세 0, 지방교육세 360만 = 3,960만
  assertClose(r.total, 39_600_000, 200, '취득세 12억');
});

test('취득세: 1주택 7.5억 (6~9억 누진식), 84㎡', () => {
  // 산식: rate% = 7.5 × 2/3 − 3 = 5 − 3 = 2%
  const r = calculateAcquisitionTax({
    acquisitionPrice: 750_000_000,
    area: 84,
    homeCount: 1,
  });
  // 본세 1,500만, 농특 0, 지방교육 150만 = 1,650만
  assertClose(r.total, 16_500_000, 200, '취득세 7.5억 누진식');
});

test('취득세: 3주택 비조정 (12%), 84㎡', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 500_000_000,
    area: 84,
    homeCount: 3,
    isRegulated: false,
  });
  // 본세 6천만, 농특 0, 지방교육 600만 = 6,600만
  assertClose(r.total, 66_000_000, 200, '취득세 3주택');
});

test('취득세: 1주택 5억 + 생애최초 감면', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 500_000_000,
    area: 84,
    homeCount: 1,
    isFirstTime: true,
  });
  // 본세 500만 − 200만 = 300만
  // 농특세 30만 (감면후세액 기준), 지방교육세 30만 = 360만
  // 작은 오차 허용
  if (r.total > 4_000_000) {
    throw new Error(`생애최초 감면 미적용? total=${r.total}`);
  }
});

test('취득세: 전용 85㎡ 이하 농특세 면제', () => {
  const r = calculateAcquisitionTax({
    acquisitionPrice: 500_000_000,
    area: 60,
    homeCount: 1,
  });
  const ruralLine = r.breakdown.find((b) => b.label === '농어촌특별세');
  if (ruralLine.amount !== 0) {
    throw new Error('농특세 면제 안 됨');
  }
});

// ============ 재산세 ============
test('재산세: 1주택 공시 5억', () => {
  const r = calculatePropertyTax({
    publishedPrice: 500_000_000,
    isOneHome: true,
  });
  // 과세표준 = 5억 × 43% = 2.15억
  // 세율: 1.5억~3억 구간 (특례) 0.2% → 본세 = 2.15억 × 0.002 − 18만 = 25만
  // 본세 약 25만, 지방교육 5만, 도시지역분 = 2.15억 × 0.14% = 30.1만
  // 총합 약 60만
  if (r.total < 400_000 || r.total > 800_000) {
    throw new Error(`재산세 5억 결과 의외값: ${r.total}`);
  }
});

test('재산세: 다주택 공시 5억', () => {
  const r1 = calculatePropertyTax({ publishedPrice: 500_000_000, isOneHome: true });
  const r2 = calculatePropertyTax({ publishedPrice: 500_000_000, isOneHome: false });
  if (r2.total <= r1.total) {
    throw new Error('다주택자가 1주택자보다 같거나 적은 재산세? 비정상');
  }
});

// ============ 종부세 ============
test('종부세: 1주택 공시 10억 (12억 공제 이하 → 비과세)', () => {
  const r = calculateComprehensivePropertyTax({
    totalPublishedPrice: 1_000_000_000,
    homeCount: 1,
    isOneHome: true,
  });
  if (r.total !== 0) {
    throw new Error(`12억 공제 이하인데 종부세 발생: ${r.total}`);
  }
});

test('종부세: 1주택 공시 15억', () => {
  const r = calculateComprehensivePropertyTax({
    totalPublishedPrice: 1_500_000_000,
    homeCount: 1,
    isOneHome: true,
  });
  // 과표 = (15억−12억)×60% = 1.8억
  // 3억 이하 구간 0.5% → 90만
  // 농특세 +20% = 108만
  if (r.total < 800_000 || r.total > 1_300_000) {
    throw new Error(`종부세 1주택 15억 의외값: ${r.total}`);
  }
});

test('종부세: 3주택 공시 30억', () => {
  const r = calculateComprehensivePropertyTax({
    totalPublishedPrice: 3_000_000_000,
    homeCount: 3,
    isOneHome: false,
  });
  // 3주택 → 중과세율 적용. 0 이상 큰 값이 나와야 함
  if (r.total <= 0) {
    throw new Error('3주택 30억 종부세 0?');
  }
});

// ============ 양도소득세 ============
test('양도세: 1세대1주택 8억 → 11억 매도 (비과세)', () => {
  const r = calculateCapitalGainsTax({
    salePrice: 1_100_000_000,
    acquisitionPrice: 800_000_000,
    expenses: 0,
    holdingYears: 5,
    residenceYears: 3,
    homeCount: 1,
    isOneHome: true,
    isRegulated: true,
  });
  if (r.total !== 0) {
    throw new Error(`12억 이하 1주택 비과세 안 됨: ${r.total}`);
  }
});

test('양도세: 1세대1주택 8억 → 15억 매도 (12억 초과분만 과세)', () => {
  const r = calculateCapitalGainsTax({
    salePrice: 1_500_000_000,
    acquisitionPrice: 800_000_000,
    expenses: 10_000_000,
    holdingYears: 10,
    residenceYears: 10,
    homeCount: 1,
    isOneHome: true,
    isRegulated: true,
  });
  // 양도차익 6.9억, 12억 초과분 비율 (3억/15억=20%) → 과세 1.38억
  // 장특공제 80% → 과표 약 2,760만
  // 250만 공제 → 2,510만
  // 15% 구간 → 약 250만 - 누진 126만 = 250만 수준
  // 지방소득세 +10%
  if (r.total < 0 || r.total > 5_000_000) {
    throw new Error(`양도세 1주택 12억 초과 결과 의외값: ${r.total}`);
  }
});

test('양도세: 다주택 단기 1년 미만 (70% 단일세율)', () => {
  const r = calculateCapitalGainsTax({
    salePrice: 800_000_000,
    acquisitionPrice: 600_000_000,
    expenses: 5_000_000,
    holdingYears: 0.5,
    homeCount: 2,
  });
  // 양도차익 1.95억, 장특공제 없음, 250만 공제 후 약 1.925억
  // 70% × 1.925억 = 약 1.35억 + 지방세 10% = 약 1.48억
  if (r.total < 100_000_000) {
    throw new Error(`단기 양도세 70% 너무 낮음: ${r.total}`);
  }
});

test('양도세: 다주택 중과 시행일 이후 (2026.5.10+)', () => {
  const r = calculateCapitalGainsTax({
    salePrice: 1_500_000_000,
    acquisitionPrice: 1_000_000_000,
    expenses: 10_000_000,
    holdingYears: 5,
    homeCount: 2,
    isOneHome: false,
    isRegulated: true,
    saleDate: '2026-06-01',
  });
  if (r.meta.rateInfo.surcharge !== 0.20) {
    throw new Error(`2주택 중과 +20%p 적용 안 됨: ${r.meta.rateInfo.surcharge}`);
  }
});

// ============ 통합 시뮬레이션 ============
test('통합 시뮬레이션: 매수~보유~매도', () => {
  const result = simulateOwnership({
    purchase: {
      acquisitionPrice: 800_000_000,
      area: 84,
      homeCount: 1,
      isFirstTime: false,
    },
    holding: {
      publishedPrice: 700_000_000,
      isOneHome: true,
    },
    sale: {
      salePrice: 1_200_000_000,
      acquisitionPrice: 800_000_000,
      expenses: 20_000_000,
      holdingYears: 7,
      residenceYears: 7,
      homeCount: 1,
      isOneHome: true,
      isRegulated: true,
    },
    holdingYears: 7,
  });
  if (!result.summary.lifetimeTotal || result.summary.lifetimeTotal < 0) {
    throw new Error('통합 시뮬레이션 실패');
  }
});

// 실행
let pass = 0;
let fail = 0;
console.log('\n=== 부동산 세금 계산 라이브러리 테스트 ===\n');
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✅ ${name}`);
    pass++;
  } catch (e) {
    console.error(`❌ ${name}\n   ${e.message}`);
    fail++;
  }
}
console.log(`\n결과: ${pass} 통과 / ${fail} 실패 / 총 ${tests.length}\n`);
if (fail > 0) process.exit(1);
