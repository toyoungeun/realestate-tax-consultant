import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import NumberInput from '../common/NumberInput.jsx';
import ResultDisplay from '../common/ResultDisplay.jsx';
import Select from '../common/Select.jsx';
import Checkbox from '../common/Checkbox.jsx';
import {
  calculatePropertyTax,
  calculateComprehensivePropertyTax,
  formatManwon,
} from '../../lib/taxCalculations.js';
import { UNIT } from '../../data/taxRates2026.js';

/**
 * 보유세 = 재산세 + 종부세
 * 두 세금 모두 6월 1일 보유자에게 부과되며 공시가격 기준으로 계산.
 */
export default function HoldingTaxCalculator() {
  const [input, setInput] = useState({
    publishedPrice: 9 * UNIT.억,
    isOneHome: true,
    homeCount: 1,
    age: 0,
    holdingYears: 0,
    includeCityTax: true,
  });
  const update = (key, value) => setInput((p) => ({ ...p, [key]: value }));

  const propertyTax = useMemo(
    () =>
      calculatePropertyTax({
        publishedPrice: input.publishedPrice,
        isOneHome: input.isOneHome,
        includeCityTax: input.includeCityTax,
      }),
    [input]
  );

  const compTax = useMemo(
    () =>
      calculateComprehensivePropertyTax({
        totalPublishedPrice: input.publishedPrice,
        homeCount: input.homeCount,
        isOneHome: input.isOneHome,
        age: input.age,
        holdingYears: input.holdingYears,
      }),
    [input]
  );

  const totalAnnual = propertyTax.total + compTax.total;

  const handleOwnershipChange = (v) => {
    const [hc, oh] = v.split('-');
    const isOne = oh === 'true';
    setInput((p) => ({
      ...p,
      homeCount: Number(hc),
      isOneHome: isOne,
      // 1주택 아닐 때는 세액공제 필드 초기화 (stale state 방지)
      age: isOne ? p.age : 0,
      holdingYears: isOne ? p.holdingYears : 0,
    }));
  };

  return (
    <Card>
      <CardHeader
        icon="🏘️"
        title="보유세 계산 (재산세 + 종부세)"
        subtitle="매년 6월 1일 보유자 기준으로 부과되는 보유세를 한 번에 계산합니다. (금액 단위: 만원)"
      />
      <CardBody>
        <div className="grid md:grid-cols-2 gap-4">
          <NumberInput
            label="공시가격"
            value={input.publishedPrice}
            onChange={(v) => update('publishedPrice', v)}
            placeholder="예: 90000 (= 9억)"
            help="국토부 부동산공시가격 알리미 기준. 만원 단위 입력."
          />
          <Select
            label="주택수 / 1세대1주택 여부"
            value={`${input.homeCount}-${input.isOneHome}`}
            onChange={handleOwnershipChange}
            options={[
              { value: '1-true', label: '1세대 1주택자' },
              { value: '2-false', label: '2주택 보유 (일반)' },
              { value: '3-false', label: '3주택 이상 (중과)' },
            ]}
          />

          {input.isOneHome && (
            <>
              <NumberInput
                label="만 나이 (1주택 세액공제용)"
                value={input.age}
                unit="세"
                suffix="세"
                onChange={(v) => update('age', v)}
                help="60세 이상부터 20~40% 공제"
              />
              <NumberInput
                label="보유 연수 (1주택 세액공제용)"
                value={input.holdingYears}
                unit="년"
                suffix="년"
                onChange={(v) => update('holdingYears', v)}
                help="5년 이상부터 20~50% 공제 (합산 최대 80%)"
              />
            </>
          )}

          <Checkbox
            className="md:col-span-2"
            label="도시지역분 포함"
            checked={input.includeCityTax}
            onChange={(v) => update('includeCityTax', v)}
            help="도시계획구역 내 부동산에 부과되는 0.14%. 대부분 도심 아파트는 포함됨."
          />
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <ResultDisplay result={propertyTax} primaryLabel="재산세 (연간)" />
          <ResultDisplay result={compTax} primaryLabel="종합부동산세 (연간)" />
        </div>

        <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5">
          <div className="text-sm text-slate-300">연간 보유세 합계 (재산세 + 종부세)</div>
          <div className="mt-1 text-3xl font-bold tabular-nums">{formatManwon(totalAnnual)}</div>
          <div className="mt-2 text-xs text-slate-400">
            ※ 7월·9월 재산세 납부 + 12월 종부세 납부. 세부담상한(전년대비 150%) 별도 적용 가능.
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
