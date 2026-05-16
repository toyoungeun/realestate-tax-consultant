// 2026년 한국 부동산(주택) 세금 세율표
// ---------------------------------------------------------------
// ⚠️ 주의: 본 데이터는 일반 사용자가 참고하기 위한 정리본이며,
//   실제 세무 신고/계산은 국세청 홈택스 공식 도구 및 세무 전문가의
//   검토를 거치시기 바랍니다.
//
// 모든 세율은 2026년 1월 1일 기준 적용 예정 값으로 정리되었습니다.
// 추후 법령 개정 시 이 파일만 수정하면 전체 계산기가 자동 반영됩니다.
// ---------------------------------------------------------------

/**
 * 단위 헬퍼
 *  - 원 단위 정수로 다룹니다.
 *  - 1억 = 100,000,000
 */
export const UNIT = {
  만: 10_000,
  억: 100_000_000,
};

/* =================================================================
 * 1. 취득세 (지방세) - 주택분
 * ================================================================= */
export const ACQUISITION_TAX = {
  // 1주택 표준세율 (개인, 유상취득)
  standardRates: [
    { upperBound: 6 * UNIT.억, rate: 0.01, label: '6억 이하' },
    // 6억~9억은 누진식 적용: 세율 = (취득가액 × 2/3억원 − 3) × 1/100
    // 코드에서는 구간 정보를 메타로만 두고, 계산함수에서 직접 산식 적용.
    { upperBound: 9 * UNIT.억, rate: 'progressive', label: '6억 초과~9억 이하 (누진식)' },
    { upperBound: Infinity, rate: 0.03, label: '9억 초과' },
  ],

  // 다주택자/법인 중과세율 (2026년 기준)
  multiHomeRates: {
    // 조정대상지역 (서울 전 지역 + 경기 일부)
    regulated: {
      2: 0.08, // 2주택자
      3: 0.12, // 3주택 이상
    },
    // 비조정대상지역
    unregulated: {
      2: 0.08, // 2주택자 (2025.10.15 대책 이후 강화)
      3: 0.12, // 3주택 이상
    },
    corporate: 0.12, // 법인은 무조건 12%
  },

  // 부가세 (취득세에 추가로 붙는 세금)
  surcharges: {
    // 농어촌특별세: 전용면적 85㎡ 초과 시 취득세의 10%
    ruralTaxRateOnAcquisition: 0.10,
    ruralTaxExemptArea: 85, // ㎡ 이하 면제

    // 지방교육세: 취득세 표준세율 × 50% × 20% = 취득세의 10%에 해당
    // (표준세율 1~3% 적용 시 0.1~0.3%)
    localEducationTaxMultiplier: 0.10,
  },

  // 생애최초 주택 구입 감면 (2026년 연장)
  firstTimeBuyer: {
    maxReduction: 2_000_000, // 200만원 한도
    maxReductionReducedArea: 3_000_000, // 인구감소지역 300만원
    priceLimit: 12 * UNIT.억, // 12억 이하 (조건)
    // 소득 요건: 폐지됨 (2025년부터)
  },
};

/* =================================================================
 * 2. 재산세 (지방세) - 주택분
 * ================================================================= */
export const PROPERTY_TAX = {
  // 일반 누진세율 (다주택 또는 9억 초과 1주택)
  standardBrackets: [
    { upperBound: 60_000_000, rate: 0.001, deduction: 0 },
    { upperBound: 150_000_000, rate: 0.0015, deduction: 30_000 },
    { upperBound: 300_000_000, rate: 0.0025, deduction: 180_000 },
    { upperBound: Infinity, rate: 0.004, deduction: 630_000 },
  ],

  // 1세대1주택자 특례세율 (공시가격 9억 이하, 2026년말까지 연장)
  oneHomeSpecialBrackets: [
    { upperBound: 60_000_000, rate: 0.0005, deduction: 0 },
    { upperBound: 150_000_000, rate: 0.001, deduction: 30_000 },
    { upperBound: 300_000_000, rate: 0.002, deduction: 180_000 },
    { upperBound: 540_000_000, rate: 0.0035, deduction: 630_000 },
  ],
  oneHomeSpecialPriceLimit: 9 * UNIT.억, // 공시가격 9억 이하만 특례

  // 공정시장가액비율 (2026년)
  fairMarketRatio: {
    standard: 0.60, // 일반
    // 1세대1주택자 특례 (공시가격 구간별 차등)
    oneHome: [
      { upperBound: 3 * UNIT.억, ratio: 0.43 },
      { upperBound: 6 * UNIT.억, ratio: 0.44 },
      { upperBound: Infinity, ratio: 0.45 },
    ],
  },

  // 부가세
  surcharges: {
    localEducationTaxRate: 0.20, // 재산세의 20%
    cityPlanningTaxRate: 0.0014, // 도시지역분 (공정시장가액 × 0.14%)
  },
};

/* =================================================================
 * 3. 종합부동산세 (국세) - 주택분
 * ================================================================= */
export const COMPREHENSIVE_PROPERTY_TAX = {
  // 기본공제
  basicDeduction: {
    oneHome: 12 * UNIT.억, // 1세대1주택자
    standard: 9 * UNIT.억, // 그 외 (인당 합산)
  },

  // 공정시장가액비율 (2026년 60% 유지)
  fairMarketRatio: 0.60,

  // 세율표 (2주택 이하 - 일반세율)
  generalBrackets: [
    { upperBound: 3 * UNIT.억, rate: 0.005, deduction: 0 },
    { upperBound: 6 * UNIT.억, rate: 0.007, deduction: 600_000 },
    { upperBound: 12 * UNIT.억, rate: 0.010, deduction: 2_400_000 },
    { upperBound: 25 * UNIT.억, rate: 0.013, deduction: 6_000_000 },
    { upperBound: 50 * UNIT.억, rate: 0.015, deduction: 11_000_000 },
    { upperBound: 94 * UNIT.억, rate: 0.020, deduction: 36_000_000 },
    { upperBound: Infinity, rate: 0.027, deduction: 101_800_000 },
  ],

  // 세율표 (3주택 이상 - 중과세율)
  multiHomeBrackets: [
    { upperBound: 3 * UNIT.억, rate: 0.005, deduction: 0 },
    { upperBound: 6 * UNIT.억, rate: 0.007, deduction: 600_000 },
    { upperBound: 12 * UNIT.억, rate: 0.010, deduction: 2_400_000 },
    { upperBound: 25 * UNIT.억, rate: 0.020, deduction: 14_400_000 },
    { upperBound: 50 * UNIT.억, rate: 0.030, deduction: 39_400_000 },
    { upperBound: 94 * UNIT.억, rate: 0.040, deduction: 89_400_000 },
    { upperBound: Infinity, rate: 0.050, deduction: 183_400_000 },
  ],

  // 농어촌특별세 (종부세의 20%)
  ruralTaxRate: 0.20,

  // 세부담상한 (전년도 대비 150%)
  taxBurdenCap: 1.50,

  // 1세대1주택 고령자/장기보유 세액공제 (최대 80%)
  oneHomeCredits: {
    elderly: [
      // 만 60세 이상
      { minAge: 60, maxAge: 65, rate: 0.20 },
      { minAge: 65, maxAge: 70, rate: 0.30 },
      { minAge: 70, maxAge: Infinity, rate: 0.40 },
    ],
    longHolding: [
      // 보유기간 5년 이상
      { minYears: 5, maxYears: 10, rate: 0.20 },
      { minYears: 10, maxYears: 15, rate: 0.40 },
      { minYears: 15, maxYears: Infinity, rate: 0.50 },
    ],
    maxCombined: 0.80, // 합산 80% 한도
  },
};

/* =================================================================
 * 4. 양도소득세 (국세) - 주택분
 * ================================================================= */
export const CAPITAL_GAINS_TAX = {
  // 기본세율 (보유 2년 이상, 일반)
  basicBrackets: [
    { upperBound: 14_000_000, rate: 0.06, deduction: 0 },
    { upperBound: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { upperBound: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { upperBound: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { upperBound: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { upperBound: 500_000_000, rate: 0.40, deduction: 25_940_000 },
    { upperBound: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { upperBound: Infinity, rate: 0.45, deduction: 65_940_000 },
  ],

  // 단기보유 중과세율
  shortTermRates: {
    under1Year: 0.70, // 1년 미만 보유
    under2Years: 0.60, // 1년 이상 2년 미만
  },

  // 다주택자 중과세율 가산 (2026.5.10 이후 적용 예정 - 한시 유예 종료)
  multiHomeAdditional: {
    twoHomes: 0.20, // 2주택자 +20%p (조정대상지역)
    threeHomes: 0.30, // 3주택 이상 +30%p (조정대상지역)
    enforcementDate: '2026-05-10', // 시행 예정일
  },

  // 1세대1주택 비과세 한도
  oneHomeExemption: {
    priceLimit: 12 * UNIT.억, // 양도가액 12억 이하 비과세
    minHoldingYears: 2,
    minResidenceYears: 2, // 조정대상지역만
  },

  // 장기보유특별공제율
  longTermDeduction: {
    // 표1: 일반 (보유 3년 이상, 최대 30%, 연 2%)
    table1: {
      minYears: 3,
      maxYears: 15,
      ratePerYear: 0.02,
      maxRate: 0.30,
    },
    // 표2: 1세대1주택 (2년 거주 충족, 보유+거주 최대 80%)
    table2: {
      minYears: 3,
      holdingMaxYears: 10,
      holdingRatePerYear: 0.04, // 연 4%
      holdingMaxRate: 0.40,
      residenceMaxYears: 10,
      residenceRatePerYear: 0.04, // 연 4%
      residenceMaxRate: 0.40,
      combinedMaxRate: 0.80,
    },
  },

  // 기본공제 (인별 연간)
  basicDeduction: 2_500_000,

  // 지방소득세 (양도세의 10%)
  localIncomeTaxRate: 0.10,
};

/* =================================================================
 * 5. 조정대상지역 (2026년 5월 기준)
 * ================================================================= */
export const REGULATED_AREAS = {
  seoul: ['전 지역 (25개 자치구)'],
  gyeonggi: [
    '과천시',
    '광명시',
    '성남시 분당구',
    '성남시 수정구',
    '성남시 중원구',
    '수원시 영통구',
    '수원시 장안구',
    '수원시 팔달구',
    '안양시 동안구',
    '용인시 수지구',
    '의왕시',
    '하남시',
  ],
  lastUpdated: '2026-02-01',
};

/* =================================================================
 * 6. 메타정보
 * ================================================================= */
export const META = {
  baseYear: 2026,
  effectiveDate: '2026-01-01',
  lastReviewed: '2026-05-16',
  disclaimer:
    '본 자료는 일반 정보 제공 목적이며 법적 효력이 없습니다. 실제 세무 신고는 국세청 홈택스 또는 세무 전문가의 도움을 받으세요.',
  officialSources: [
    { label: '국세청', url: 'https://www.nts.go.kr' },
    { label: '홈택스', url: 'https://hometax.go.kr' },
    { label: '국토교통부', url: 'https://www.molit.go.kr' },
    { label: '행정안전부 (지방세)', url: 'https://www.mois.go.kr' },
  ],
};

export default {
  ACQUISITION_TAX,
  PROPERTY_TAX,
  COMPREHENSIVE_PROPERTY_TAX,
  CAPITAL_GAINS_TAX,
  REGULATED_AREAS,
  META,
  UNIT,
};
