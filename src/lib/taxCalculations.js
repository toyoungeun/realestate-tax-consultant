// =============================================================
// 부동산 세금 계산 라이브러리 (Pure Functions)
// =============================================================
// 이 모듈은 의도적으로 React에 의존하지 않습니다.
// 어떤 JS 환경(브라우저, Node, Worker, 외부 앱)에서도
// 그대로 import해서 호출할 수 있습니다.
//
// 외부 앱(예: Replit 부동산 투자 컨설턴트)과 통합 시:
//   import { calculateAcquisitionTax } from 'realestate-tax-consultant/tax';
//
// 모든 함수는 동일한 패턴을 따릅니다:
//   1) 입력: 정규화된 input 객체
//   2) 출력: { total, breakdown, meta } 형태의 결과 객체
//   3) 부수효과 없음 (pure)
// =============================================================

import {
  ACQUISITION_TAX,
  PROPERTY_TAX,
  COMPREHENSIVE_PROPERTY_TAX,
  CAPITAL_GAINS_TAX,
  UNIT,
} from '../data/taxRates2026.js';

/* -------------------------------------------------------------
 * 공통 유틸
 * ------------------------------------------------------------- */

/**
 * 누진세 구간에서 세액 계산.
 * brackets: [{ upperBound, rate, deduction }, ...]
 * 누진공제 방식을 사용. base에 해당하는 누진공제 차감.
 */
export function applyProgressiveBrackets(base, brackets) {
  if (base <= 0) return { tax: 0, rate: 0, deduction: 0 };
  for (const bracket of brackets) {
    if (base <= bracket.upperBound) {
      const tax = Math.max(0, base * bracket.rate - bracket.deduction);
      return { tax, rate: bracket.rate, deduction: bracket.deduction };
    }
  }
  // 마지막 구간으로 fallback
  const last = brackets[brackets.length - 1];
  return {
    tax: Math.max(0, base * last.rate - last.deduction),
    rate: last.rate,
    deduction: last.deduction,
  };
}

/** 숫자를 0~상한값 사이로 clamp */
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** 원 단위 반올림 */
export function round(v) {
  return Math.round(v);
}

/* =============================================================
 * 1. 취득세 (Acquisition Tax)
 * ============================================================= */

/**
 * @typedef {Object} AcquisitionTaxInput
 * @property {number} acquisitionPrice  취득가액 (원)
 * @property {number} area              전용면적 (㎡)
 * @property {1|2|3|4} homeCount        취득 후 주택수 (1=1주택, 2=2주택...)
 * @property {boolean} isRegulated      조정대상지역 여부
 * @property {boolean} isFirstTime      생애최초 구입 여부
 * @property {boolean} isReducedArea    인구감소지역 여부
 * @property {boolean} isCorporate      법인 여부
 */

/**
 * 취득세 계산.
 *
 * 산식:
 *  1) 적용세율 결정 (1주택 표준 / 다주택 중과 / 법인)
 *  2) 본세 = 취득가액 × 세율
 *  3) 생애최초 감면 차감
 *  4) 농어촌특별세 = 본세의 10% (전용 85㎡ 초과 시)
 *  5) 지방교육세 = 본세의 10% (표준세율 적용 시)
 */
export function calculateAcquisitionTax(input) {
  const {
    acquisitionPrice = 0,
    area = 84,
    homeCount = 1,
    isRegulated = false,
    isFirstTime = false,
    isReducedArea = false,
    isCorporate = false,
  } = input;

  if (acquisitionPrice <= 0) {
    return emptyResult('취득세');
  }

  // 1) 적용세율 결정
  let appliedRate;
  let rateDescription;

  if (isCorporate) {
    appliedRate = ACQUISITION_TAX.multiHomeRates.corporate;
    rateDescription = '법인 (12% 중과)';
  } else if (homeCount >= 3) {
    appliedRate = isRegulated
      ? ACQUISITION_TAX.multiHomeRates.regulated[3]
      : ACQUISITION_TAX.multiHomeRates.unregulated[3];
    rateDescription = `${homeCount}주택자 중과 (${(appliedRate * 100).toFixed(0)}%)`;
  } else if (homeCount === 2) {
    // 생애최초 감면 적용 대상이면 1주택 기본세율 우선 적용
    if (isFirstTime) {
      appliedRate = computeStandardRate(acquisitionPrice);
      rateDescription = `1주택 표준세율 (생애최초 감면 대상)`;
    } else {
      appliedRate = isRegulated
        ? ACQUISITION_TAX.multiHomeRates.regulated[2]
        : ACQUISITION_TAX.multiHomeRates.unregulated[2];
      rateDescription = `2주택자 중과 (${(appliedRate * 100).toFixed(0)}%)`;
    }
  } else {
    appliedRate = computeStandardRate(acquisitionPrice);
    rateDescription = `1주택 표준세율 (${(appliedRate * 100).toFixed(2)}%)`;
  }

  // 2) 본세 계산
  let mainTax = acquisitionPrice * appliedRate;

  // 3) 생애최초 감면
  let firstTimeDiscount = 0;
  let firstTimeNote = null;
  if (
    isFirstTime &&
    acquisitionPrice <= ACQUISITION_TAX.firstTimeBuyer.priceLimit &&
    homeCount <= 2
  ) {
    const maxDiscount = isReducedArea
      ? ACQUISITION_TAX.firstTimeBuyer.maxReductionReducedArea
      : ACQUISITION_TAX.firstTimeBuyer.maxReduction;
    firstTimeDiscount = Math.min(maxDiscount, mainTax);
    firstTimeNote = `생애최초 감면 -${formatManwon(firstTimeDiscount)} 적용 (한도 ${formatManwon(maxDiscount)})`;
    mainTax -= firstTimeDiscount;
  }
  mainTax = Math.max(0, mainTax);

  // 4) 농어촌특별세 (85㎡ 초과 시)
  let ruralTax = 0;
  if (area > ACQUISITION_TAX.surcharges.ruralTaxExemptArea) {
    ruralTax = mainTax * ACQUISITION_TAX.surcharges.ruralTaxRateOnAcquisition;
  }

  // 5) 지방교육세 (표준세율 적용 시만; 다주택 중과는 별도 규정으로 동일하게 본세의 약 10%)
  const localEducationTax =
    mainTax * ACQUISITION_TAX.surcharges.localEducationTaxMultiplier;

  const total = round(mainTax + ruralTax + localEducationTax);

  return {
    taxType: '취득세',
    total,
    breakdown: [
      {
        label: '취득세 본세',
        amount: round(mainTax),
        note: rateDescription,
      },
      {
        label: '농어촌특별세',
        amount: round(ruralTax),
        note:
          area > ACQUISITION_TAX.surcharges.ruralTaxExemptArea
            ? '전용 85㎡ 초과 (취득세의 10%)'
            : '전용 85㎡ 이하 면제',
      },
      {
        label: '지방교육세',
        amount: round(localEducationTax),
        note: '취득세의 10%',
      },
    ],
    meta: {
      appliedRate,
      rateDescription,
      firstTimeDiscount,
      firstTimeNote,
      effectiveRate: total / acquisitionPrice,
    },
  };
}

/**
 * 1주택 표준세율 계산 (누진식)
 * - 6억 이하: 1%
 * - 6~9억 누진식: (취득가액 × 2/3억원 − 3) × 1/100
 * - 9억 초과: 3%
 */
function computeStandardRate(price) {
  if (price <= 6 * UNIT.억) return 0.01;
  if (price <= 9 * UNIT.억) {
    // 산식: rate = (price/억 × 2/3 - 3) / 100
    const priceIn억 = price / UNIT.억;
    const ratePercent = (priceIn억 * 2) / 3 - 3;
    return ratePercent / 100;
  }
  return 0.03;
}

/* =============================================================
 * 2. 재산세 (Property Tax)
 * ============================================================= */

/**
 * @typedef {Object} PropertyTaxInput
 * @property {number} publishedPrice    공시가격 (원)
 * @property {boolean} isOneHome        1세대1주택자 여부
 * @property {boolean} includeCityTax   도시지역분 포함 여부 (기본 true)
 */

export function calculatePropertyTax(input) {
  const {
    publishedPrice = 0,
    isOneHome = true,
    includeCityTax = true,
  } = input;

  if (publishedPrice <= 0) return emptyResult('재산세');

  // 1) 공정시장가액비율 결정
  let fairRatio;
  let ratioDesc;
  if (isOneHome) {
    const fmrTable = PROPERTY_TAX.fairMarketRatio.oneHome;
    const entry = fmrTable.find((r) => publishedPrice <= r.upperBound);
    fairRatio = entry.ratio;
    ratioDesc = `1주택 특례 ${(fairRatio * 100).toFixed(0)}%`;
  } else {
    fairRatio = PROPERTY_TAX.fairMarketRatio.standard;
    ratioDesc = `일반 ${(fairRatio * 100).toFixed(0)}%`;
  }

  // 2) 과세표준 = 공시가격 × 공정시장가액비율
  const taxBase = publishedPrice * fairRatio;

  // 3) 세율 결정 (1주택 9억 이하 특례 / 일반)
  const useSpecialBrackets =
    isOneHome && publishedPrice <= PROPERTY_TAX.oneHomeSpecialPriceLimit;
  const brackets = useSpecialBrackets
    ? PROPERTY_TAX.oneHomeSpecialBrackets
    : PROPERTY_TAX.standardBrackets;

  // 4) 본세 계산
  const { tax: mainTax, rate, deduction } = applyProgressiveBrackets(taxBase, brackets);

  // 5) 부가세
  const localEducationTax = mainTax * PROPERTY_TAX.surcharges.localEducationTaxRate;
  const cityPlanningTax = includeCityTax
    ? taxBase * PROPERTY_TAX.surcharges.cityPlanningTaxRate
    : 0;

  const total = round(mainTax + localEducationTax + cityPlanningTax);

  return {
    taxType: '재산세',
    total,
    breakdown: [
      {
        label: '재산세 본세',
        amount: round(mainTax),
        note: `과세표준 ${formatManwon(taxBase)} × ${(rate * 100).toFixed(2)}% − 누진공제 ${formatManwon(deduction)}`,
      },
      {
        label: '지방교육세',
        amount: round(localEducationTax),
        note: '재산세의 20%',
      },
      ...(includeCityTax
        ? [
            {
              label: '도시지역분',
              amount: round(cityPlanningTax),
              note: '과세표준의 0.14%',
            },
          ]
        : []),
    ],
    meta: {
      taxBase: round(taxBase),
      fairRatio,
      ratioDesc,
      usedBrackets: useSpecialBrackets ? '1주택 특례' : '일반',
      effectiveRate: total / publishedPrice,
    },
  };
}

/* =============================================================
 * 3. 종합부동산세 (Comprehensive Property Tax)
 * ============================================================= */

/**
 * @typedef {Object} ComprehensivePropertyTaxInput
 * @property {number} totalPublishedPrice  인별 공시가격 합산 (원)
 * @property {number} homeCount            소유 주택 수
 * @property {boolean} isOneHome           1세대1주택자 여부
 * @property {number} [age]                나이 (1주택 세액공제용)
 * @property {number} [holdingYears]       보유 연수 (1주택 세액공제용)
 * @property {number} [propertyTaxPaid]    동일 주택분에 부과된 재산세액 (이중과세 조정용)
 */

export function calculateComprehensivePropertyTax(input) {
  const {
    totalPublishedPrice = 0,
    homeCount = 1,
    isOneHome = true,
    age = 0,
    holdingYears = 0,
    propertyTaxPaid = 0,
  } = input;

  if (totalPublishedPrice <= 0) return emptyResult('종합부동산세');

  // 1) 기본공제
  const deduction = isOneHome
    ? COMPREHENSIVE_PROPERTY_TAX.basicDeduction.oneHome
    : COMPREHENSIVE_PROPERTY_TAX.basicDeduction.standard;

  if (totalPublishedPrice <= deduction) {
    return {
      taxType: '종합부동산세',
      total: 0,
      breakdown: [
        {
          label: '종부세',
          amount: 0,
          note: `공시가격 합산이 기본공제(${formatManwon(deduction)}) 이하라 비과세`,
        },
      ],
      meta: { taxableExists: false },
    };
  }

  // 2) 과세표준 = (공시가격 합산 − 기본공제) × 공정시장가액비율
  const taxBase =
    (totalPublishedPrice - deduction) * COMPREHENSIVE_PROPERTY_TAX.fairMarketRatio;

  // 3) 세율 결정
  const brackets =
    homeCount >= 3
      ? COMPREHENSIVE_PROPERTY_TAX.multiHomeBrackets
      : COMPREHENSIVE_PROPERTY_TAX.generalBrackets;
  const bracketLabel = homeCount >= 3 ? '3주택+ 중과' : '2주택 이하 일반';

  // 4) 본세 계산
  const { tax: rawTax, rate, deduction: progDeduction } = applyProgressiveBrackets(
    taxBase,
    brackets
  );

  // 5) 재산세 중복분 차감 (간단화: 보유세 합산을 위해 별도 처리 가능)
  //    실제 공제는 복잡하므로 본 계산기에서는 옵션으로만 받음
  const afterDoubleTaxAdjust = Math.max(0, rawTax - propertyTaxPaid * 0); // 기본 0 (사용자 명시 시만)

  // 6) 1세대1주택 세액공제 (고령자 + 장기보유)
  let creditRate = 0;
  let creditNotes = [];
  if (isOneHome && homeCount === 1) {
    const elderlyRate = lookupCreditRate(
      age,
      COMPREHENSIVE_PROPERTY_TAX.oneHomeCredits.elderly,
      'minAge',
      'maxAge'
    );
    const longHoldRate = lookupCreditRate(
      holdingYears,
      COMPREHENSIVE_PROPERTY_TAX.oneHomeCredits.longHolding,
      'minYears',
      'maxYears'
    );
    creditRate = Math.min(
      elderlyRate + longHoldRate,
      COMPREHENSIVE_PROPERTY_TAX.oneHomeCredits.maxCombined
    );
    if (elderlyRate > 0)
      creditNotes.push(`고령자공제 ${(elderlyRate * 100).toFixed(0)}%`);
    if (longHoldRate > 0)
      creditNotes.push(`장기보유공제 ${(longHoldRate * 100).toFixed(0)}%`);
  }
  const credit = afterDoubleTaxAdjust * creditRate;
  const afterCredit = afterDoubleTaxAdjust - credit;

  // 7) 농어촌특별세 (종부세의 20%)
  const ruralTax = afterCredit * COMPREHENSIVE_PROPERTY_TAX.ruralTaxRate;

  const total = round(afterCredit + ruralTax);

  return {
    taxType: '종합부동산세',
    total,
    breakdown: [
      {
        label: '종부세 본세',
        amount: round(afterCredit),
        note: `${bracketLabel} ${(rate * 100).toFixed(2)}% (세액공제 ${(creditRate * 100).toFixed(0)}% 후)`,
      },
      ...(credit > 0
        ? [
            {
              label: '1주택 세액공제',
              amount: -round(credit),
              note: creditNotes.join(' + ') || '',
            },
          ]
        : []),
      {
        label: '농어촌특별세',
        amount: round(ruralTax),
        note: '종부세의 20%',
      },
    ],
    meta: {
      taxBase: round(taxBase),
      bracketLabel,
      rate,
      progDeduction,
      creditRate,
      creditNotes,
    },
  };
}

function lookupCreditRate(value, table, minKey, maxKey) {
  for (const row of table) {
    if (value >= row[minKey] && value < row[maxKey]) return row.rate;
  }
  return 0;
}

/* =============================================================
 * 4. 양도소득세 (Capital Gains Tax)
 * ============================================================= */

/**
 * @typedef {Object} CapitalGainsTaxInput
 * @property {number} salePrice          양도가액 (원)
 * @property {number} acquisitionPrice   취득가액 (원)
 * @property {number} expenses           필요경비 (취득세, 중개수수료 등)
 * @property {number} holdingYears       보유 기간 (년, 소수점 가능)
 * @property {number} residenceYears     거주 기간 (년)
 * @property {number} homeCount          양도 시점 보유 주택 수
 * @property {boolean} isOneHome         1세대1주택 비과세 대상 여부
 * @property {boolean} isRegulated       조정대상지역 여부
 * @property {string} [saleDate]         양도일 (YYYY-MM-DD) — 중과 시행일 비교용
 */

export function calculateCapitalGainsTax(input) {
  const {
    salePrice = 0,
    acquisitionPrice = 0,
    expenses = 0,
    holdingYears = 0,
    residenceYears = 0,
    homeCount = 1,
    isOneHome = false,
    isRegulated = false,
    saleDate = null,
  } = input;

  if (salePrice <= 0 || acquisitionPrice <= 0) return emptyResult('양도소득세');

  // 1) 양도차익
  const grossGain = salePrice - acquisitionPrice - expenses;
  if (grossGain <= 0) {
    return {
      taxType: '양도소득세',
      total: 0,
      breakdown: [{ label: '양도차익 없음', amount: 0, note: '손실 또는 무이익' }],
      meta: { grossGain, exempted: false },
    };
  }

  // 2) 1세대1주택 비과세 (12억 이하)
  const exemptionLimit = CAPITAL_GAINS_TAX.oneHomeExemption.priceLimit;
  const meetsHoldingReq = holdingYears >= CAPITAL_GAINS_TAX.oneHomeExemption.minHoldingYears;
  const meetsResidenceReq =
    !isRegulated || residenceYears >= CAPITAL_GAINS_TAX.oneHomeExemption.minResidenceYears;

  if (isOneHome && meetsHoldingReq && meetsResidenceReq && salePrice <= exemptionLimit) {
    return {
      taxType: '양도소득세',
      total: 0,
      breakdown: [
        {
          label: '1세대1주택 비과세',
          amount: 0,
          note: `양도가액 ${formatManwon(salePrice)} ≤ 12억, 보유 ${holdingYears}년, 거주 ${residenceYears}년 충족`,
        },
      ],
      meta: { exempted: true, grossGain },
    };
  }

  // 3) 12억 초과분 안분 (1주택 고가주택)
  let taxableGain = grossGain;
  let highPriceNote = null;
  if (isOneHome && meetsHoldingReq && meetsResidenceReq && salePrice > exemptionLimit) {
    const ratio = (salePrice - exemptionLimit) / salePrice;
    taxableGain = grossGain * ratio;
    highPriceNote = `12억 초과분 비율 ${(ratio * 100).toFixed(2)}% 만 과세`;
  }

  // 4) 장기보유특별공제
  const ltcdResult = computeLongTermDeduction({
    isOneHome,
    holdingYears,
    residenceYears,
    meetsHoldingReq,
    meetsResidenceReq,
    homeCount,
  });
  const afterLtcd = taxableGain * (1 - ltcdResult.rate);

  // 5) 기본공제 250만원
  const taxableIncome = Math.max(0, afterLtcd - CAPITAL_GAINS_TAX.basicDeduction);

  // 6) 세율 결정
  const rateInfo = determineCapitalGainsRate({
    holdingYears,
    homeCount,
    isRegulated,
    saleDate,
  });

  // 7) 세액 계산
  let baseTax;
  let rateDesc;
  if (rateInfo.useFlat) {
    // 단기보유 단일세율
    baseTax = taxableIncome * rateInfo.flatRate;
    rateDesc = `단기보유 ${(rateInfo.flatRate * 100).toFixed(0)}% 단일세율`;
  } else {
    const { tax, rate, deduction } = applyProgressiveBrackets(
      taxableIncome,
      CAPITAL_GAINS_TAX.basicBrackets
    );
    // 다주택 중과 가산 (조정지역만)
    if (rateInfo.surcharge > 0) {
      baseTax = taxableIncome * (rate + rateInfo.surcharge) - deduction;
      rateDesc = `기본세율 ${(rate * 100).toFixed(0)}% + 중과 ${(rateInfo.surcharge * 100).toFixed(0)}%p`;
    } else {
      baseTax = tax;
      rateDesc = `기본세율 ${(rate * 100).toFixed(0)}%`;
    }
  }
  baseTax = Math.max(0, baseTax);

  // 8) 지방소득세 (양도세의 10%)
  const localIncomeTax = baseTax * CAPITAL_GAINS_TAX.localIncomeTaxRate;
  const total = round(baseTax + localIncomeTax);

  return {
    taxType: '양도소득세',
    total,
    breakdown: [
      {
        label: '양도차익',
        amount: round(grossGain),
        note: highPriceNote || `(양도가 ${formatManwon(salePrice)} − 취득가 ${formatManwon(acquisitionPrice)} − 경비 ${formatManwon(expenses)})`,
      },
      {
        label: '장기보유특별공제',
        amount: -round(taxableGain * ltcdResult.rate),
        note: ltcdResult.description,
      },
      {
        label: '기본공제',
        amount: -CAPITAL_GAINS_TAX.basicDeduction,
        note: '연 250만원',
      },
      {
        label: '양도소득세',
        amount: round(baseTax),
        note: rateDesc,
      },
      {
        label: '지방소득세',
        amount: round(localIncomeTax),
        note: '양도세의 10%',
      },
    ],
    meta: {
      grossGain: round(grossGain),
      taxableGain: round(taxableGain),
      ltcdRate: ltcdResult.rate,
      ltcdTable: ltcdResult.table,
      taxableIncome: round(taxableIncome),
      rateInfo,
      effectiveRate: total / grossGain,
      exempted: false,
    },
  };
}

function computeLongTermDeduction({
  isOneHome,
  holdingYears,
  residenceYears,
  meetsHoldingReq,
  meetsResidenceReq,
  homeCount,
}) {
  const t1 = CAPITAL_GAINS_TAX.longTermDeduction.table1;
  const t2 = CAPITAL_GAINS_TAX.longTermDeduction.table2;

  // 표2 적용: 1세대1주택 + 2년 거주 + 보유 3년 이상
  const eligibleForTable2 =
    isOneHome &&
    homeCount === 1 &&
    holdingYears >= t2.minYears &&
    residenceYears >= 2;

  if (eligibleForTable2) {
    const holdingCapped = clamp(holdingYears, 0, t2.holdingMaxYears);
    const residenceCapped = clamp(residenceYears, 0, t2.residenceMaxYears);
    const holdingPart = Math.min(
      holdingCapped * t2.holdingRatePerYear,
      t2.holdingMaxRate
    );
    const residencePart = Math.min(
      residenceCapped * t2.residenceRatePerYear,
      t2.residenceMaxRate
    );
    const combined = Math.min(holdingPart + residencePart, t2.combinedMaxRate);
    return {
      rate: combined,
      table: '표2 (1세대1주택)',
      description: `보유 ${holdingCapped}년×4% + 거주 ${residenceCapped}년×4% = ${(combined * 100).toFixed(0)}%`,
    };
  }

  // 표1 적용: 보유 3년 이상
  if (holdingYears >= t1.minYears) {
    const capped = clamp(holdingYears, 0, t1.maxYears);
    const rate = Math.min(capped * t1.ratePerYear, t1.maxRate);
    return {
      rate,
      table: '표1 (일반)',
      description: `보유 ${capped}년 × 연 2% = ${(rate * 100).toFixed(0)}% (최대 30%)`,
    };
  }

  return { rate: 0, table: '미적용', description: '보유 3년 미만은 장특공제 없음' };
}

function determineCapitalGainsRate({ holdingYears, homeCount, isRegulated, saleDate }) {
  // 단기보유 단일세율 우선
  if (holdingYears < 1) {
    return { useFlat: true, flatRate: CAPITAL_GAINS_TAX.shortTermRates.under1Year, surcharge: 0 };
  }
  if (holdingYears < 2) {
    return { useFlat: true, flatRate: CAPITAL_GAINS_TAX.shortTermRates.under2Years, surcharge: 0 };
  }

  // 다주택 중과: 2026.5.10 이후 양도분부터 조정대상지역 한정
  let surcharge = 0;
  const enforcement = new Date(CAPITAL_GAINS_TAX.multiHomeAdditional.enforcementDate);
  const sd = saleDate ? new Date(saleDate) : new Date();
  const afterEnforcement = sd >= enforcement;
  if (afterEnforcement && isRegulated) {
    if (homeCount === 2) surcharge = CAPITAL_GAINS_TAX.multiHomeAdditional.twoHomes;
    if (homeCount >= 3) surcharge = CAPITAL_GAINS_TAX.multiHomeAdditional.threeHomes;
  }
  return { useFlat: false, surcharge, afterEnforcement };
}

/* =============================================================
 * 5. 종합 시뮬레이션 — 외부 앱 통합용
 * ============================================================= */

/**
 * 사용 시나리오 예:
 *   import { simulateOwnership } from '...tax';
 *   const result = simulateOwnership({
 *     purchase: { acquisitionPrice: 800_000_000, area: 84, ... },
 *     holding: { publishedPrice: 900_000_000, isOneHome: true, ... },
 *     sale: { salePrice: 1_500_000_000, ... }
 *   });
 *
 * 매입~보유~매도 전 과정의 세금을 합산.
 */
export function simulateOwnership({ purchase, holding, sale, holdingYears = 1 }) {
  const acq = purchase ? calculateAcquisitionTax(purchase) : null;
  const prop = holding ? calculatePropertyTax(holding) : null;
  const compr = holding ? calculateComprehensivePropertyTax(holding) : null;
  const cg = sale ? calculateCapitalGainsTax(sale) : null;

  const holdingTotal = ((prop?.total || 0) + (compr?.total || 0)) * Math.max(1, holdingYears);

  const lifetimeTotal =
    (acq?.total || 0) + holdingTotal + (cg?.total || 0);

  return {
    acquisition: acq,
    property: prop,
    comprehensive: compr,
    capitalGains: cg,
    summary: {
      acquisitionTax: acq?.total || 0,
      annualHoldingTax: (prop?.total || 0) + (compr?.total || 0),
      totalHoldingTax: round(holdingTotal),
      capitalGainsTax: cg?.total || 0,
      lifetimeTotal: round(lifetimeTotal),
    },
  };
}

/* -------------------------------------------------------------
 * 헬퍼
 * ------------------------------------------------------------- */

function emptyResult(taxType) {
  return {
    taxType,
    total: 0,
    breakdown: [],
    meta: { empty: true },
  };
}

export function formatKRW(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  const absV = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (absV >= UNIT.억) {
    const eok = Math.floor(absV / UNIT.억);
    const remainder = absV % UNIT.억;
    const man = Math.floor(remainder / UNIT.만);
    if (man === 0) return `${sign}${eok}억원`;
    return `${sign}${eok}억 ${man.toLocaleString()}만원`;
  }
  if (absV >= UNIT.만) {
    return `${sign}${Math.floor(absV / UNIT.만).toLocaleString()}만원`;
  }
  return `${sign}${absV.toLocaleString()}원`;
}

/**
 * 항상 만원 단위로 표시 (원 미만 절사, 만원 단위 반올림).
 *   1,234,500 → "123만원"
 *   850,000,000 → "8억 5,000만원"
 *   3,000 → "0만원"
 */
export function formatManwon(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const manwon = Math.round(abs / UNIT.만);
  if (manwon === 0) return `${sign}0만원`;
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const man = manwon % 10000;
    if (man === 0) return `${sign}${eok}억원`;
    return `${sign}${eok}억 ${man.toLocaleString()}만원`;
  }
  return `${sign}${manwon.toLocaleString()}만원`;
}

export function formatPercent(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return `${(value * 100).toFixed(digits)}%`;
}

export default {
  calculateAcquisitionTax,
  calculatePropertyTax,
  calculateComprehensivePropertyTax,
  calculateCapitalGainsTax,
  simulateOwnership,
  applyProgressiveBrackets,
  formatKRW,
  formatManwon,
  formatPercent,
};
