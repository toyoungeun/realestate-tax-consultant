import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card.jsx';
import NumberInput from '../common/NumberInput.jsx';
import ResultDisplay from '../common/ResultDisplay.jsx';
import Select from '../common/Select.jsx';
import { calculateCapitalGainsTax, formatManwon } from '../../lib/taxCalculations.js';
import { UNIT } from '../../data/taxRates2026.js';

export default function CapitalGainsTaxCalculator() {
  const [input, setInput] = useState({
    salePrice: 15 * UNIT.억,
    acquisitionPrice: 8 * UNIT.억,
    expenses: 2000 * UNIT.만, // 2,000만원
    holdingYears: 10,
    residenceYears: 10,
    homeCount: 1,
    isOneHome: true,
    isRegulated: true,
    // 양도일 기본값: 오늘 날짜 (KST 기준)
    saleDate: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  const update = (key, value) => setInput((p) => ({ ...p, [key]: value }));

  const result = useMemo(() => calculateCapitalGainsTax(input), [input]);

  const profit = input.salePrice - input.acquisitionPrice - input.expenses;

  const handleOwnershipChange = (v) => {
    const [hc, oh] = v.split('-');
    setInput((p) => ({
      ...p,
      homeCount: Number(hc),
      isOneHome: oh === 'true',
    }));
  };

  return (
    <Card>
      <CardHeader
        icon="💰"
        title="양도소득세 계산"
        subtitle="아파트 매도 시 발생하는 양도세를 보유/거주기간, 주택수, 비과세 조건까지 반영해 계산합니다. (금액 단위: 만원)"
      />
      <CardBody>
        <div className="grid md:grid-cols-2 gap-4">
          <NumberInput
            label="양도가액 (매도가)"
            value={input.salePrice}
            onChange={(v) => update('salePrice', v)}
            placeholder="예: 150000 (= 15억)"
          />
          <NumberInput
            label="취득가액 (매수가)"
            value={input.acquisitionPrice}
            onChange={(v) => update('acquisitionPrice', v)}
            placeholder="예: 80000 (= 8억)"
          />
          <NumberInput
            label="필요경비"
            value={input.expenses}
            onChange={(v) => update('expenses', v)}
            help="취득세, 중개수수료, 자본적 지출(인테리어 등) 합계 (만원 단위)"
          />
          <div className="bg-slate-50 rounded-lg p-3 flex flex-col justify-center border border-slate-200">
            <div className="text-xs text-slate-500">양도차익 (Gain)</div>
            <div
              className={`text-xl font-bold tabular-nums ${
                profit > 0 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {formatManwon(profit)}
            </div>
          </div>

          <NumberInput
            label="보유 기간"
            value={input.holdingYears}
            unit="년"
            suffix="년"
            step="0.5"
            onChange={(v) => update('holdingYears', v)}
            help="2년 미만은 단기 중과(60~70%) 적용"
          />
          <NumberInput
            label="거주 기간"
            value={input.residenceYears}
            unit="년"
            suffix="년"
            step="0.5"
            onChange={(v) => update('residenceYears', v)}
            help="1주택 표2 적용 위해 최소 2년 거주 필요"
          />

          <Select
            label="주택수 / 1세대1주택 여부"
            value={`${input.homeCount}-${input.isOneHome}`}
            onChange={handleOwnershipChange}
            options={[
              { value: '1-true', label: '1세대 1주택 (비과세 검토)' },
              { value: '2-false', label: '2주택자' },
              { value: '3-false', label: '3주택 이상' },
            ]}
          />

          <Select
            label="조정대상지역 여부"
            value={input.isRegulated ? 'yes' : 'no'}
            onChange={(v) => update('isRegulated', v === 'yes')}
            options={[
              { value: 'yes', label: '조정대상지역' },
              { value: 'no', label: '비조정지역' },
            ]}
          />

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700 mb-1 block">
              양도일 (잔금 지급일)
            </span>
            <input
              type="date"
              value={input.saleDate}
              onChange={(e) => update('saleDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              ⚠️ 2026년 5월 10일 이후 양도 시 다주택자 +20~30%p 중과세율 적용 (한시 유예 종료
              예정 — 정부 발표에 따라 추가 유예 가능)
            </p>
          </label>
        </div>

        <ResultDisplay result={result} primaryLabel="양도소득세 + 지방소득세 합계" />

        {result.meta?.exempted && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
            <div className="font-semibold text-emerald-900">✅ 비과세 대상</div>
            <div className="text-emerald-700 mt-1">
              1세대1주택 + 양도가 12억 이하 + 보유/거주 요건 충족
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-slate-500 leading-relaxed">
          ※ 일시적 2주택, 상속/증여, 조합원입주권/분양권, 임대주택 등 특례는 별도 검토가
          필요합니다. 본 결과는 일반 계산이며 정확한 세액은 세무 전문가 검토를 권장합니다.
        </div>
      </CardBody>
    </Card>
  );
}
